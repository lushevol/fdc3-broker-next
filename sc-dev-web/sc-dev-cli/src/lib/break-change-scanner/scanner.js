/**
 * Scan the break chagnes of @scwebkit
 */

import babel, { parse, traverse } from '@babel/core';
import parser from '@babel/parser';
import t, { isEnumNumberBody } from '@babel/types';
import chalk from 'chalk';
import fs from 'fs';
import { ColorVarMap, RuleChangedTypeMap, RuleList, showRuleTips } from './scan-rules.config.js';
import { generate } from '@babel/generator';

const DEFAULT_PLACEHOLDER = '{null}';
const STYLE_REG = /(([^\/]\/\/\s*)?<\s*style\s*>)([\s\S]+?)(([^\/]\/\/\s*)?<\/\s*style\s*>)/g;
/**
 * transform file code to JSX code type
 * Eliminate those code may affecting jsx parsing
 * @param {string} code original file code
 * @returns {string} jsxCode
 */
const processFileCode2JSXCode = (code) => {
  const changedList = [];
  const tmpCode = code.replaceAll(STYLE_REG, (_, p1, p2, p3, p4, p5, index) => {
    const result = `${p1}${p3.replace(/\S/g, ' ')}${p4}`;
    const startLine = code.slice(0, index + p1.length + 1).split('\n').length - 1;
    const lineCount =
      code.slice(0, index + (p1 + p3 + p4).length + 1).split('\n').length - startLine;

    changedList.push({
      startLine,
      lineCount,
      code: p3,
    });
    return result;
  });
  // .replaceAll(/(\s+)(@)(\w+)/g, (_, p1, p2, p3, index) => {
  //   const result = `${p1}SC_AT${p3}`;
  //   const startLine = code.slice(0, index + p1.length + 1).split('\n').length - 1;
  //   const lineCount = code.slice(0, index + _.length + 1).split('\n').length - startLine;

  //   changedList.push({
  //     startLine,
  //     lineCount,
  //     code: p2,
  //   });
  //   return result;
  // });
  return { code: tmpCode, changedList };
};

/**
 * @param {*} code  jsx code
 * @param {*} changedInfo  changed list
 * @returns {string} file code
 */
const reverseJSXCode2FileCode = (code, changedList = [], maxDiff) => {
  if (!changedList?.length) return code;
  const resCode = code
    .replaceAll(STYLE_REG, (_, p1, p2, p3, p4, p5, index) => {
      const curLine = code.slice(0, index + p1.length + 1).split('\n').length - 1;
      const curLineCount =
        code.slice(0, index + (p1 + p3 + p4).length + 1).split('\n').length - curLine;

      const targetChange = changedList.find((item) => {
        return (
          item.lineCount === curLineCount && Math.abs(curLine - item.startLine) <= Math.abs(maxDiff)
        );
      });
      if (targetChange) {
        return `${p1}${targetChange.code}${p4}`;
      }

      return _;
    })
    .replaceAll('SC_AT', '@');
  return resCode;
};

/**
 * combine JSX pared quasis into Lit type code
 * and compute the location info of each quasi
 * @param {*} node TaggedElement (html`` part)
 * @returns {Record<{
 *  value: string; // Lit type code
 *  loc: Array<any>; // quasis location info
 * }>}
 */
const processLitHtml = (node) => {
  const { quasis, expressions } = node.quasi;

  const parsedQuasiInfo = quasis.reduce(
    (acc, cur, index) => {
      const lastEndLine = acc.loc[acc.loc.length - 1]?.endLine;
      const startLine = lastEndLine ? lastEndLine + 1 : 1;

      let val =
        '\n' +
        (index === 0 ? '<>' : '') +
        cur.value.raw +
        (index === quasis.length - 1 ? '</>' : '');

      val = val.replace(/([^=]=)(\s*)$/, (_, p1, p2) => `${p1}${DEFAULT_PLACEHOLDER}${p2}`);

      const lineCount = val.split('\n').length - 1;
      acc.loc.push({
        index,
        startLine,
        lineCount,
        endLine: startLine + lineCount - 1,
        start: acc.value.length,
        end: acc.value.length + val.length - 1,
        rawValue: val,
      });
      acc.value += val;
      return acc;
    },
    {
      value: '',
      loc: [],
    },
  );
  // let start = 1;
  // let base = quasis[0].loc.start.line;
  // quasis.forEach((q, idex) => {
  //   start = q.loc.start.line - base + 1;
  //   q.value.raw.split('\n').forEach((i, idx) => {
  //     console.log(chalk.bgGray(idx + start), i);
  //   });
  //   console.log(parsedQuasiInfo.loc[idex]);
  // });
  parsedQuasiInfo.value = parsedQuasiInfo.value
    .replaceAll('SC_AT', '@')
    .replace(/\s+([@\.\?])([\w-_]+)/g, (match, p1, p2) => {
      return ` ${p2}`;
    })
    .replace(/(<!--[\s\S]*-->)/gm, (_, p1) => {
      return ` ${p1.replace(/\S/g, ' ')} `;
    })
    .replace(/""""/gm, '"  "');
  parsedQuasiInfo.value = `<>${parsedQuasiInfo.value}</>`;
  return parsedQuasiInfo;
};

/**
 * Auto-fix break changes (Only Attribute part)
 * @param {*} node
 * @param {*} param1
 * @param {*} location
 * @returns
 */
const fixQuasiNode = (node, { ruleInfo, attr: rule }, location) => {
  const { compQuasiIndex, quasiIndex, startOffset } = location;
  const { type, name, removeValue = [], ...rest } = rule;
  const isStart = compQuasiIndex === quasiIndex;
  const targetQuasi = node?.quasis?.[quasiIndex];

  const res = {
    fixed: false,
    tip: '',
  };

  if (!targetQuasi) {
    return res;
  }

  let regPrefix = '';
  if (isStart) {
    regPrefix = `\\s*<\\s*${ruleInfo.compName}\\s+[^>]*`;
  } else {
    regPrefix = `^[^><\\/]*`;
  }
  const targetAttrRegStr = `\\W*${name}(\\s+|\\s*=)`;
  const targetAttrReg = new RegExp(targetAttrRegStr);
  const endReg = new RegExp(`(${targetAttrRegStr}\\s*)(['"]|{null})\\s*$`);

  ['raw', 'cooked'].forEach((t, idx) => {
    let resultStr = targetQuasi.value[t];
    const isEnd = endReg.test(resultStr);

    const matches = resultStr.matchAll(new RegExp(`${regPrefix}${targetAttrRegStr}`, 'g'));
    // console.log('in fix', compQuasiIndex, quasiIndex, isStart, isEnd, ruleInfo, rule);
    let tip = '';
    let fixed = false;
    for (const match of matches) {
      // console.log('in match', match);
      if (!targetAttrReg.test(match[0] || '')) continue;

      tip += '\n';
      switch (type) {
        case 'removed': {
          tip += `Removed the attribute ${name}. `;
          if (removeValue?.length) {
            // replace default value
            if (isEnd) {
              tip = '';
              resultStr = resultStr.replace(/{null}(\\s*)$/, '$1');
            } else {
              resultStr = resultStr.replace(
                new RegExp(`(${targetAttrRegStr}\\s*['"])(\\s*\\w+\\s*)(['"][>|\\s+])`),
                (_, p1, P2, p3, p4) => {
                  const k = p3?.trim() || '';
                  if (k && removeValue.includes(k)) {
                    const targetVal = rest.changeTo?.find((item) => item[0] === k)?.[1];
                    const finalVal = targetVal || rest.defaultVal || '';
                    tip += `Replaced with the value "${chalk.bgYellow(finalVal)}" `;
                    return `${p1}${finalVal}${p4}`;
                  }
                  return _;
                },
              );
            }
          } else if (!removeValue?.length) {
            if (isEnd) {
              // need handle 2 quasis
              resultStr = resultStr.replace(endReg, ' ');
              node.expressions?.splice(tmpIndex, 1);
              if (node.quasis[tmpIndex + 1]?.value?.[t]) {
                node.quasis[tmpIndex + 1].value[t] = node.quasis[tmpIndex + 1].value.raw.replace(
                  /^\s*['"]\s+/,
                  ' ',
                );
              }
            } else {
              resultStr = resultStr
                .replace(
                  new RegExp(`${targetAttrRegStr}\\s*['"][\\s\\w]*['"]([>|\\s*])`),
                  (_, p1, p2) => ` ${p2}`,
                )
                // replace the boolean attr
                .replace(new RegExp(`(\\W+)${name}(\\s+)`), '$1 $2');
            }
          }
          fixed = !!tip;
          break;
        }
        case 'changed-removed': {
          if (removeValue?.length && !isEnd) {
            // replace default value
            resultStr = resultStr.replace(
              new RegExp(`(${targetAttrRegStr}\\s*['"])(\\s*\\w+\\s*)(['"][>|\\s+])`),
              (_, p1, p2, p3, p4) => {
                const k = p3?.trim() || '';
                if (k && removeValue.includes(k)) {
                  const targetVal = rest.changeTo?.find((item) => item[0] === k)?.[1];
                  const finalVal = targetVal || rest.defaultVal || '';
                  tip += `Replaced with the value "${chalk.bgYellow(finalVal)}" `;
                  return `${p1}${finalVal}${p4}`;
                }
                return _;
              },
            );
          }
          fixed = !!tip;
          break;
        }
        default: {
        }
      }
    }
    if (idx === 0) {
      res.tip += tip;
      res.fixed ||= fixed;
    }

    if (fixed || resultStr !== targetQuasi.value[t]) {
      targetQuasi.value[t] = resultStr;
    }
  });

  return res;
};

/**
 * Check BreakChanges of SC-Component
 * @param {*} node  Component path node
 * @param {*} fileNode  HTML tag node
 * @param {*} parsedInfo  parsed info of Lit type code
 * @param {boolean} autoFix  whether to fix changes
 * @returns check & fix result
 */
const checkSingleComponent = (node, fileNode, parsedInfo, autoFix, filePath) => {
  const target = RuleList.find((rule) => rule.compName === node.openingElement.name.name);
  const result = [];
  if (!target) return result;
  const compName = `${target.name} <${target.compName}>`;

  const { attrs = [], ...restRule } = target;
  const attributes = node.openingElement.attributes;
  const toChangeList = [];
  for (const attr of attrs) {
    const targetAttrNode = attributes.find((a) => a.name.name === attr.name);

    if (!targetAttrNode && attr.type !== 'changed-default') continue;

    let tip = '';
    const { type, name, removeValue = [], ...rest } = attr || {};
    const openingElementReg = new RegExp(`<\\s*${node.openingElement.name.name}\\s+`);
    let openingTagIndex = parsedInfo.loc.find(
      (item) =>
        item.startLine <= node.openingElement.loc.start.line &&
        item.endLine >= node.openingElement.loc.start.line &&
        openingElementReg.test(item.rawValue),
    );
    if (!openingTagIndex) {
      openingTagIndex = parsedInfo.loc.find((item) => {
        return (
          openingElementReg.test(item.rawValue) &&
          Math.abs(item.startLine - node.openingElement.loc.start.line) < 15
        );
      });
    }

    const targetAttrReg = new RegExp(`\\W+${name}\\W+`);
    let targetAttrIndex = parsedInfo.loc.find(
      (item) =>
        targetAttrReg.test(item.rawValue) &&
        item.startLine <= targetAttrNode?.loc.start.line &&
        item.endLine >= targetAttrNode?.loc.end.line,
    );
    if (!targetAttrIndex) {
      targetAttrIndex = parsedInfo.loc.find(
        (item) =>
          targetAttrReg.test(item.rawValue) &&
          Math.abs(item.startLine - targetAttrNode?.loc.start.line) < 15,
      );
    }
    const targetQuasi = fileNode.quasi?.quasis?.[targetAttrIndex?.index];
    const targetLocation = {
      compQuasiIndex: openingTagIndex?.index,
      quasiIndex: targetAttrIndex?.index,
      // In parsedInfo, add 1 line for each quasi.
      nodeOffset: targetAttrNode?.loc?.start?.line - node.openingElement.loc?.start?.line,
      startOffset: targetAttrNode?.loc?.start?.line - (targetAttrIndex?.startLine - 1) || 0,
      column: targetAttrNode?.loc?.start?.column,
    };
    targetLocation.line = fileNode.loc.start.line + targetLocation.startOffset;

    let fixed = false;

    switch (type) {
      case 'removed': {
        tip = `ATTRIBUTE: ${chalk.blue(name)} has been removed.`;
        if (removeValue?.length) {
          tip = `Attr value: ${chalk.red([].concat(removeValue).join(', '))} of ${tip}`;
          if (t.isLiteral(targetAttrNode.value) && targetAttrNode.value.value) {
            if (removeValue.includes(targetAttrNode.value.value)) {
              const targetVal = rest.changeTo?.find(
                (item) => item[0] === targetAttrNode.value.value,
              )?.[1];
              tip +=
                `\nThe value ${targetAttrNode.value.value} should be changed ` + targetVal
                  ? `to ${chalk.blue(targetVal)}`
                  : rest.defaultVal
                  ? `to the default value ${chalk.yellow(rest.defaultVal)}`
                  : '' + '.';
            } else {
              // with the proper value, no need to warning
              tip = '';
            }
          } else {
            tip += `\nCannot find the specific value, please check manually. If already fixed, just ignore this tip, thanks.`;
          }
        }
        // when tip is empty, nothing to do
        if (autoFix && tip) {
          const res = fixQuasiNode(
            fileNode.quasi,
            {
              attr,
              ruleInfo: restRule,
            },
            targetLocation,
          );
          fixed = res.fixed;
          tip += res.fixed
            ? `\n${chalk.green('[Fixed]')} ${res.tip || ''}`
            : `\n${chalk.yellow('[Unfixed]')} Please check manually.`;
        }

        if (tip) {
          const changedCfg = RuleChangedTypeMap[type] || {};
          tip = `${chalk[changedCfg?.color]?.(
            `[${changedCfg.prefix || ''} - ${type.toUpperCase()}]`,
          )} ${tip}`;
        }
        break;
      }
      case 'changed-removed': {
        if (removeValue?.length) {
          tip = `Attr value: ${chalk.red(
            [].concat(removeValue).join(', '),
          )} of ATTRIBUTE: ${chalk.blue(name)} has been removed.`;
          if (t.isLiteral(targetAttrNode.value) && targetAttrNode.value.value) {
            if (removeValue.includes(targetAttrNode.value.value)) {
              const targetVal = rest.changeTo?.find(
                (item) => item[0] === targetAttrNode.value.value,
              )?.[1];
              tip +=
                `\nThe value ${targetAttrNode.value.value} should be changed ` + targetVal
                  ? `to ${chalk.blue(targetVal)}`
                  : rest.defaultVal
                  ? `to the default value ${chalk.yellow(rest.defaultVal)}`
                  : '' + '.';
            } else {
              tip = '';
            }
          } else {
            tip += `\nCannot find the specific value, please check manually. If already fixed, just ignore this tip, thanks.`;
          }
        }
        if (autoFix && tip) {
          const res = fixQuasiNode(
            fileNode.quasi,
            {
              attr,
              ruleInfo: restRule,
            },
            targetLocation,
          );
          fixed = res.fixed;
          tip += res.fixed
            ? `\n${chalk.green('[Fixed]')} ${res.tip || ''}`
            : `\n${chalk.yellow('[Unfixed]')} Please check manually.`;
        }
        if (tip) {
          const changedCfg = RuleChangedTypeMap.tips;
          tip = `${chalk[changedCfg?.color]?.(`[${changedCfg.prefix || ''}]`)} ${tip}`;
        }
        break;
      }
      case 'changed-default': {
        if (!targetAttrNode) {
          const changedCfg = RuleChangedTypeMap['tips'];
          tip = `${chalk[changedCfg.color]?.(
            `[${changedCfg.prefix}]`,
          )} The default value of ATTRIBUTE: ${chalk.blue(name)} has been changed to ${
            rest.defaultVal || ''
          }. Please check it.`;
        }
        break;
      }
      default: {
        break;
      }
    }

    if (tip) {
      const locationSuffix =
        targetQuasi && targetAttrNode
          ? `:${targetQuasi.loc.start.line + targetLocation.startOffset - 1}:${
              targetLocation.column
            }`
          : '';
      const locationTip = ` ${filePath}${locationSuffix}`;
      tip = chalk.bgBlueBright(compName) + ' ' + tip + locationTip;
      toChangeList.push({
        fixed,
        rule: attr,
        ruleInfo: restRule,
        attr: targetAttrNode,
        tip,
        locationTip,
      });
    }
  }

  if (toChangeList.length) {
    result.push({
      node,
      compName,
      breakChanges: toChangeList,
    });
  }
  return result;
};

const scanColorVarialbes = (code) => {
  const result = [];
  Object.entries(ColorVarMap).forEach(([type, list]) => {
    const isRemoved = type === 'removed';
    [].concat(list).forEach((item) => {
      const reg = new RegExp(`(var\\(\\s*)(${item.name})\\s*[,\\)]`, 'g');
      const matches = code.matchAll(reg);
      let locations = [];
      for (const match of matches) {
        if (match[0] && match.index) {
          const locIndex = match.index + (match[1].length || 3);
          const codeArr = code.slice(0, locIndex + 1).split('\n');
          locations.push(
            `:${codeArr.length}:${codeArr.slice(-1)[0].indexOf(match[1]) + match[1].length + 1}`,
          );
        }
      }
      if (locations.length) {
        result.push({
          type,
          ...item,
          locations,
          tip: `The color ${chalk[isRemoved ? 'bgGray' : 'bgYellow'](item.name)} has been ${type}${
            isRemoved ? '.' : ` (${item.value} -> ${item.changeTo || ''}).`
          }`,
        });
      }
    });
  });
  return result;
};

export const scanAndFixSCWebkitLitElement = async (file, scanType = 'scan-only') => {
  const autoFix = scanType === 'auto-fix';
  const fileContent = await babel.transformFileAsync(file);

  const { code } = fileContent;
  const { code: jsxCode, changedList } = processFileCode2JSXCode(code);

  const ast = await parser.parse(jsxCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const scanResult = [];
  const errors = [];
  let fixed = false;

  // Handle the changes of Component Attributes by parsing AST.
  traverse(ast, {
    TaggedTemplateExpression(path) {
      if (t.isIdentifier(path.node.tag, { name: 'html' })) {
        const tip = `\n
--------------------process file--------------------
${file}
`;
        const { value: litTpl, ...parsedInfo } = processLitHtml(path.node);

        // console.log(
        //   'html',
        //   litTpl
        //     .split('\n')
        //     .map((i, idx) => `${idx + 1} ${i}`)
        //     .join('\n'),
        //   '\n',
        //   path.node.loc,
        // );
        let hasPrintTitle = false;
        try {
          const litHtmlAst = parser.parse(litTpl, {
            sourceType: 'unambiguous',
            plugins: ['jsx', 'typescript'],
          });

          let toChangeCount = 0;
          traverse(litHtmlAst, {
            JSXElement(jsxPath) {
              const result = checkSingleComponent(
                jsxPath.node,
                path.node,
                parsedInfo,
                autoFix,
                file,
              );
              toChangeCount += result.length;

              result.forEach((r) => {
                r.breakChanges.forEach((item) => {
                  fixed ||= item.fixed;

                  if (item.tip) {
                    if (!hasPrintTitle) {
                      console.log(tip);
                      hasPrintTitle = true;
                    }
                    console.log(item.tip, '\n');
                  }

                  scanResult.push({
                    ...item,
                    fileInfo: {
                      tag: path.node.tag,
                      loc: path.node.loc,
                    },
                  });
                });
              });
            },
          });
          // toChangeCount &&
          //   console.log(
          //     'html',
          //     litTpl
          //       .split('\n')
          //       .map((i, idx) => `${idx + 1} ${i}`)
          //       .join('\n'),
          //     '\n',
          //     // parsedInfo.loc,
          //   );
        } catch (e) {
          !hasPrintTitle && console.log(tip);
          console.log(chalk.red('[Parse Lit Element Error]'), ', Please manually check the file.');
          console.log(chalk.bgGray(e?.message || e), e);
          // console.log(litTpl);
          errors.push({
            error: e,
            tip: `${chalk.red('[Parse Lit Element Error]')}, Please manually check the file.`,
            tpl: litTpl,
          });
        }
      }
    },
  });

  // scan the removed color variables
  let colorScanResults = [];
  if (!autoFix) {
    colorScanResults = scanColorVarialbes(code);
    colorScanResults.forEach((item) => {
      const isStartNewLine = item.locations.length > 1;
      item.tip += `${isStartNewLine ? '\n' : ''}${item.locations
        .map((i) => `${file}${i}`)
        .join('\n')}`;
    });
  }

  if (autoFix && fixed) {
    const { code: newCode } = generate(ast);
    const maxDiff = code.split('\n').length - newCode.split('\n').length;
    const newFile = reverseJSXCode2FileCode(newCode, changedList, maxDiff);

    fs.writeFileSync(file, newFile, 'utf-8');
    console.log(chalk.bgGreen('[Auto-Fixed Done]'), file);
  }
  return {
    file,
    fixed,
    result: scanResult,
    colorScanResults,
    errors,
  };
};

const CodeScannerTools = {
  scanAndFixSCWebkitLitElement,
};

export default CodeScannerTools;
