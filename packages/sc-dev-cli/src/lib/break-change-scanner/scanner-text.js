/**
 * Scan the break chagnes of @scwebkit
 */

import chalk from 'chalk';
import fs from 'fs';
import { ColorVarMap, RuleChangedTypeMap, RuleList } from './scan-rules.config.js';

const getLocation = (code = '') => {
  const arr = code.split('\n');
  return {
    line: arr.length,
    column: arr.slice(-1)[0].length,
  };
};

const handleSingleRule = (code, ruleInfo, rule, autoFix, filePath) => {
  const { compName, name: ruleName, message: msgOfCom } = ruleInfo || {};
  const { type, name, removeValue = [], defaultVal, changeTo, message: msgOfAttr, ...rest } = rule;

  let resultCode = code;
  let tip = '';
  let fixed = false;
  const compReg = new RegExp(
    `(<\\s*${compName}(?:\\s*>|(?:\\s+[\\.\\?@]?[\\w-]+=?(?:\\s*|(?:"[^"]*")|(?:'[^']*')|(?:\\$?\\{[\\s\\S]*?\\})))*\\s*>))([\\s\\S]*?)<\\s*\/\\s*${compName}\\s*>`,
  );
  const attrRegStr = `(?:(?:\\s*|^)[\\.\\?]?)${name}(?:=|\\s+|>|$)`;
  const attrReg = new RegExp(attrRegStr);
  let tmpCode = resultCode;
  let baseIndex = 0;
  let match = tmpCode.match(compReg);
  let count = 0;
  const statistics = {
    canAuto: 0,
    needManual: 0,
    fixed: 0,
    unfixed: 0,
  };
  const notNeedAttr = type === 'changed-default';
  while (match?.[0] && count < 100) {
    count++;
    let tmpStr = match?.[1];
    let tmpTip = '';
    let fixedTip = '';
    let tmpFixed = false;
    let cfgType = type;
    let posIndex = 0;
    const curIndex = match.index + baseIndex;
    if (attrReg.test(tmpStr) || notNeedAttr) {
      switch (type) {
        case 'removed': {
          tmpTip += `ATTRIBUTE: "${chalk.blue(name)}" has been removed.`;
          tmpTip += msgOfAttr || '';
          if (removeValue?.length) {
            tmpTip = `Attr value: "${chalk.red([].concat(removeValue).join(', '))}" of ${tmpTip}`;
            let isSatisfiedBefore = false;
            tmpStr = tmpStr
              .replace(
                new RegExp(
                  `(\\s+[\\.\\?]?${name}\\s?=)(?:\\s?['"]?\\s?\\$?\\{[\\s\\S]*?\\}\\s?['"]?)`,
                ),
                (_, p1, index) => {
                  cfgType = 'tips';
                  fixedTip += `Cannot get the specific final attribute value, please check manually. If already fixed, just ignore this tip, thanks.`;
                  posIndex = index;
                  statistics.needManual++;
                  autoFix && statistics.unfixed++;
                  isSatisfiedBefore = true;
                  return _;
                },
              )
              .replace(
                new RegExp(`(\\s+[\\.\\?]?${name}\\s?=)(?:\\s?(['"])\\s*([\\w-]*)\\s*['"])`),
                (_, p1, p2, p3, index) => {
                  if (isSatisfiedBefore) {
                    return _;
                  }
                  isSatisfiedBefore = true;
                  const k = p3?.trim() || '';
                  posIndex = index;
                  if (!k) {
                    cfgType = 'tips';
                    statistics.needManual++;
                    autoFix && statistics.unfixed++;
                    fixedTip += 'Please check manually.';
                  } else if (removeValue.includes(k)) {
                    cfgType = type;
                    const targetVal = changeTo?.find((item) => item[0] === k)?.[1];
                    if (targetVal) {
                      tmpTip += `\nThe value "${k}" should be changed to "${chalk.blue(
                        targetVal,
                      )}".`;
                      statistics.canAuto++;
                      if (autoFix) {
                        statistics.fixed++;
                        tmpFixed = true;
                        fixedTip += `Replaced with the value "${chalk.bgYellow(targetVal)}" `;
                        return `${p1}${p2}${targetVal}${p2}`;
                      }
                    } else {
                      cfgType = 'tips';
                      statistics.needManual++;
                      autoFix && statistics.unfixed++;
                      fixedTip += 'Please check manually.';
                    }
                  } else {
                    tmpTip = '';
                  }
                  return _;
                },
              );
            if (!isSatisfiedBefore) {
              tmpTip = '';
            }
          } else {
            // directly delete attribute

            const whetherDelIfEmpty = compName === 'sc-button' && ['fill'].includes(name);
            if (whetherDelIfEmpty) {
              tmpStr = tmpStr.replace(
                new RegExp(`(\\s+[\\.\\?]?${name}\\s?=?)(?:\\s?(['"])\\s*([\\w-]*)\\s*['"])`),
                (_, p1, p2, p3, index) => {
                  cfgType = type;
                  statistics.canAuto++;
                  if (autoFix) {
                    statistics.fixed++;
                    tmpFixed = true;
                    fixedTip += `Attribute deleted!`;
                    return ` `;
                  }
                  return _;
                },
              );
            } else {
              cfgType = 'tips';
              fixedTip += 'Please check manually.';
              posIndex = match.index;
              statistics.needManual++;
              if (autoFix) {
                statistics.unfixed++;
              }
            }
          }
          break;
        }
        case 'changed-removed': {
          if (removeValue?.length) {
            tmpTip = `Attr value: "${chalk.red(
              [].concat(removeValue).join(', '),
            )}" of ATTRIBUTE: "${chalk.blue(name)}" has been removed.`;
            let isSatisfiedBefore = false;
            tmpStr = tmpStr
              .replace(
                new RegExp(
                  `(\\s+[\\.\\?]?${name}\\s?=\\s?)(?:['"]?\\s?\\$?\\{[\\s\\S]*?\\}\\s?['"]?)`,
                ),
                (_, p1, index) => {
                  isSatisfiedBefore = true;
                  statistics.needManual++;
                  autoFix && statistics.unfixed++;
                  fixedTip += `Cannot get the specific final attribute value, please check manually. If already fixed, just ignore this tip, thanks.`;
                  posIndex = index;
                  return _;
                },
              )
              .replace(
                new RegExp(`(\\s+[\\.\\?]?${name}\\s?=)(?:\\s?(['"])\\s*([\\w-]*)\\s*['"])`),
                (_, p1, p2, p3, index) => {
                  if (isSatisfiedBefore) {
                    return _;
                  }
                  isSatisfiedBefore = true;
                  const k = p3?.trim() || '';
                  posIndex = index;
                  if (!k) {
                    statistics.needManual++;
                    autoFix && statistics.unfixed++;
                    fixedTip += 'Please check manually.';
                  } else if (removeValue.includes(k)) {
                    const targetVal = changeTo?.find((item) => item[0] === k)?.[1];

                    if (targetVal) {
                      cfgType = 'removed';
                      tmpTip += `\nThe value "${k}" should be changed to "${chalk.blue(
                        targetVal,
                      )}".`;
                      statistics.canAuto++;
                      if (autoFix) {
                        statistics.fixed++;
                        tmpFixed = true;
                        fixedTip += `Replaced with the value "${chalk.bgYellow(targetVal)}" `;
                        return `${p1}${p2}${targetVal}${p2}`;
                      }
                    } else {
                      cfgType = 'tips';
                      statistics.needManual++;
                      autoFix && statistics.unfixed++;
                      fixedTip += 'Please check manually.';
                    }
                  } else {
                    tmpTip = '';
                  }
                  return _;
                },
              );
            if (!isSatisfiedBefore) {
              tmpTip = '';
            }
          }
          break;
        }
        case 'changed-attr': {
          if (rest.changeToAttr) {
            tmpTip = `ATTRIBUTE: "${chalk.blue(
              name,
            )}" need to be replaced by ATTRIBUTE: "${chalk.yellow(rest.changeToAttr)}".`;

            let isSatisfiedBefore = false;
            tmpStr = tmpStr
              .replace(
                new RegExp(
                  `(\\s+[\\.\\?]?${name}\\s?=)(?:\\s?['"]?\\s?\\$?\\{[\\s\\S]*?\\}\\s?['"]?)`,
                ),
                (_, p1, index) => {
                  console.log('changed-attr', p1, _);
                  isSatisfiedBefore = true;
                  statistics.needManual++;
                  autoFix && statistics.unfixed++;
                  fixedTip += `Cannot get the specific final attribute value, please check manually. If already fixed, just ignore this tip, thanks.`;
                  posIndex = index;
                  return _;
                },
              )
              .replace(
                new RegExp(`(\\s+[\\.\\?]?${name}\\s?=)(?:\\s?(['"])\\s*([\\w-]+)\\s*['"])`),
                (_, p1, p2, p3, index) => {
                  if (isSatisfiedBefore) {
                    return _;
                  }
                  isSatisfiedBefore = true;
                  cfgType = 'removed';
                  const k = p3?.trim() || '';
                  posIndex = index;
                  let targetVal = k;
                  if (changeTo?.length) {
                    targetVal = changeTo?.find((item) => !item[0] || item[0] === k)?.[1];
                  }

                  if (targetVal && rest.changeToAttr) {
                    tmpTip += `\nThe value "${k}" should be changed to "${chalk.blue(targetVal)}".`;
                    statistics.canAuto++;
                    if (autoFix) {
                      statistics.fixed++;
                      tmpFixed = true;
                      fixedTip += `Replaced with "${chalk.bgYellow(
                        `${rest.changeToAttr}=${targetVal}`,
                      )}" `;
                      return `${p1.replace(name, rest.changeToAttr)}${p2}${targetVal}${p2}`;
                    }
                  } else {
                    tmpTip = '';
                  }
                  return _;
                },
              )
              .replace(new RegExp(`\\s+(${name})\\s+`), (_, p1, index) => {
                if (isSatisfiedBefore || !rest.changeToAttr || changeTo?.length) {
                  return _;
                }
                isSatisfiedBefore = true;
                posIndex = index;
                if (rest.changeToAttr) {
                  statistics.canAuto++;
                  if (autoFix) {
                    statistics.fixed++;
                    tmpFixed = true;
                    fixedTip += `Replaced with "${chalk.bgYellow(`${rest.changeToAttr}`)}" `;
                    // return `${p1}${rest.changeToAttr}${p3}`;
                    return rest.changeToAttr;
                  }
                } else {
                  tmp = '';
                }
                return _;
              });
            if (!isSatisfiedBefore) {
              tmpTip = '';
            }
          }
          break;
        }
        case 'changed-default': {
          cfgType = 'tips';
          if (!attrReg.test(match[1])) {
            tmpTip = `The default value of ATTRIBUTE: "${chalk.blue(
              name,
            )}" has been changed to "${chalk.yellow(defaultVal || '')}". Please check manually.`;
            statistics.needManual++;
            autoFix && statistics.unfixed++;
          }
          break;
        }
        default: {
        }
      }
      if (tmpFixed && autoFix) {
        const match1Idx = curIndex + match[0].indexOf(match[1]);
        resultCode =
          resultCode.substring(0, match1Idx) +
          tmpStr +
          resultCode.substr(match1Idx + match[1].length);
      }

      if (/\w+/.test(tmpTip)) {
        const changedCfg = RuleChangedTypeMap[cfgType] || RuleChangedTypeMap.tips;
        tmpTip = chalk[changedCfg.color](`[${changedCfg.prefix}]`) + ' ' + tmpTip + '\n';

        if (autoFix) {
          tmpTip +=
            (tmpFixed ? chalk.bgGreen('[FIXED]') : chalk.bgYellow('[WARNING-UNFIXED]')) +
            ' ' +
            (fixedTip || 'Please fix it manually.');
        } else if (fixedTip) {
          tmpTip += chalk.bgYellow('[WARNING]') + ' ' + fixedTip || 'Please fix it manually.';
        }

        if (compName === 'sc-table') {
          tmpTip = msgOfCom + tmpTip;
        }

        const loc = getLocation(resultCode.slice(0, curIndex + (Number(posIndex) || 0)));
        tmpTip += `  (${filePath || ''}:${loc.line}:${loc.column})`;
        tip += `\n${tmpTip}\n`;
      }
      fixed ||= tmpFixed;
    }

    baseIndex = curIndex + match[0].length + (tmpStr.length - match[1].length);
    tmpCode = resultCode.substr(baseIndex);
    match = tmpCode.match(compReg);
  }

  if (/\w+/.test(tip)) {
    tip = `\n\n------------${chalk.blue(
      `${ruleName} <${compName}>`,
    )}------------\n${filePath}\n${tip}`;
    console.log(tip);
  }

  return {
    code: resultCode,
    fixed,
    statistics,
    tip,
  };
};

const checkAndFixAllAttrRules = (code, autoFix, filePath, fixTableOnly) => {
  const res = {
    result: [],
    errors: [],
    fixed: false,
    statistics: {
      canAuto: 0,
      needManual: 0,
      fixed: 0,
      unfixed: 0,
    },
    tableStatistics: {
      canAuto: 0,
      needManual: 0,
      fixed: 0,
      unfixed: 0,
    },
    code,
  };
  let resultCode = code;
  let rules = RuleList;
  if (autoFix) {
    if (fixTableOnly) {
      rules = rules.filter((item) => item.compName === 'sc-table');
    } else {
      rules = rules.filter((item) => item.compName !== 'sc-table');
    }
  }
  rules.forEach((rule) => {
    const { attrs = [], ...ruleInfo } = rule;
    try {
      attrs?.forEach((r) => {
        const { code, fixed, statistics, tip } = handleSingleRule(
          resultCode,
          ruleInfo,
          r,
          autoFix,
          filePath,
        );

        if (autoFix && fixed) {
          resultCode = code;
        }
        res.fixed ||= fixed;
        if (tip) {
          res.result.push({
            tip,
            ruleInfo,
            rule: r,
          });
        }
        for (const p in res.statistics) {
          if (ruleInfo.compName === 'sc-table') {
            res.tableStatistics[p] += statistics?.[p] || 0;
          } else {
            res.statistics[p] += statistics?.[p] || 0;
          }
        }
      });
    } catch (e) {
      console.log(
        `Error occured when parsing ${ruleInfo.name}<${ruleInfo.compName}> with attr ${
          rule.name
        }. \n${e?.message || e}`,
      );
      res.errors.push(
        `Error occured when parsing ${ruleInfo.name}<${ruleInfo.compName}> with attr ${
          rule.name
        }. \n${e?.message || e}`,
      );
    }
  });
  if (autoFix && res.fixed) {
    res.code = resultCode;
  }

  return res;
};

const scanColorVarialbes = (code, autoFix) => {
  const result = [];
  let tmpCode = code;
  let fixed = false;
  const statistics = {
    canAuto: 0,
    fixed: 0,
    needManual: 0,
    unfixed: 0,
  };
  Object.entries(ColorVarMap).forEach(([type, list]) => {
    const isRemoved = type === 'removed';
    [].concat(list).forEach((item) => {
      let locations = [];
      if (type === 'computed-spacing') {
        // custom logic for spacing variables
        tmpCode = tmpCode.replace(
          new RegExp(`([\\s\(]${item.name})(\\d{1,2})\\b`, 'g'),
          (_, p1, p2, index) => {
            const tmp = Number(p2);
            if (item.step && tmp > 0) {
              let replaceBy;
              if (tmp % item.step === 0) {
                statistics.needManual++;
                autoFix && statistics.unfixed++;
              } else {
                replaceBy = `${p1}${tmp * 4}`;
                statistics.canAuto++;
                autoFix && statistics.fixed++;
              }

              const loc = getLocation(code.slice(0, index));
              locations.push(`:${loc.line}:${loc.column}`);

              return autoFix ? replaceBy ?? _ : _;
            }
            return _;
          },
        );
        if (locations.length) {
          const fixedTip = autoFix
            ? statistics.fixed > 0 && statistics.unfixed === 0
              ? `${chalk.bgGreen('[FIXED]')} Replaced done!`
              : statistics.fixed > 0 && statistics.unfixed > 0
              ? `${chalk.bgYellow('[FIXED]')} Partially replaced done! Still have ${
                  statistics.unfixed
                } variables to manually fix.`
              : statistics.unfixed > 0
              ? `${chalk.bgYellow('[UNFIXED]')} Please check manually.`
              : ''
            : '';
          result.push({
            type,
            ...item,
            locations,
            tip:
              chalk.yellow('[WARNING]') +
              `The variable ${chalk.bgYellow(item.name + 'i')} has been changed (${item.name}i -> ${
                item.name
              }{i * 4}).\n${fixedTip} (Total: ${locations.length})\n`,
          });
        }
      } else {
        const reg = new RegExp(`(var\\s*\\(\\s*)(${item.name})(\\s*[,\\)])`, 'g');
        const matches = code.matchAll(reg);
        for (const match of matches) {
          if (match[0] && match.index) {
            const locIndex = match.index + (match[1].length || 3);
            const loc = getLocation(tmpCode.slice(0, locIndex));
            locations.push(`:${loc.line}:${loc.column}`);
          }
        }
        if (locations.length) {
          if (!!item.replaceBy) {
            statistics.canAuto += locations.length;
            autoFix && (statistics.fixed += locations.length);
          } else {
            statistics.needManual += locations.length;
            autoFix && (statistics.unfixed += locations.length);
          }
        }

        if (autoFix && item.replaceBy && locations.length) {
          tmpCode = tmpCode.replaceAll(reg, `$1${item.replaceBy}$3`);
        }

        if (locations.length) {
          result.push({
            type,
            ...item,
            locations,
            tip:
              chalk.yellow('[WARNING]') +
              `The color ${chalk[isRemoved ? 'bgRed' : 'bgYellow'](item.name)} has been ${type}${
                isRemoved ? '.' : ` (${item.value} -> ${item.changeTo || ''}).`
              } \n${
                item.replaceBy
                  ? (autoFix ? `${chalk.bgGreen('[FIXED]')} Replaced` : 'Please replace') +
                    ` it by ${item.replaceBy}. (Total: ${locations.length})\n`
                  : ''
              }`,
          });
        }
      }
    });
  });
  return { result, statistics, code: tmpCode };
};

export const scanAndFixSCWebkitLitElement = async (
  file,
  scanType = 'scan-only',
  fixTableOnly = false,
) => {
  const autoFix = scanType === 'auto-fix';
  const fileContent = fs.readFileSync(file, 'utf-8');
  // console.log('file', file);
  // console.log(fileContent);

  // Scan Attributes
  const {
    result,
    errors,
    fixed: attrFixed,
    statistics,
    tableStatistics,
    code: newCode,
  } = checkAndFixAllAttrRules(fileContent, autoFix, file, fixTableOnly);

  // Scan Color variables
  const {
    result: colorScanResults,
    statistics: colorStatistics,
    code: colorCode,
  } = scanColorVarialbes(newCode, autoFix);
  const colorFixed = colorStatistics.fixed > 0;
  colorScanResults.forEach((item) => {
    const isStartNewLine = item.locations.length > 1;
    item.tip += `${isStartNewLine ? '\n' : ''}${item.locations
      .map((i) => `${file}${i}`)
      .join('\n')}`;
  });

  let writeableContent = colorCode;
  if (fixTableOnly) {
    // update tag name
    const tableOpen = /(<\s*)(\bsc-table\b)([^>]*)(\s*>)/gi;
    const tableClose = /(<\s*\/\s*)(\bsc-table\b)(\s*>)/gi;
    writeableContent = writeableContent.replace(tableOpen, '$1sc-data-grid$3$4');
    writeableContent = writeableContent.replace(tableClose, '$1sc-data-grid$3');
  }

  const fileFixed = attrFixed || colorFixed;
  if (autoFix && fileFixed) {
    fs.writeFileSync(file, writeableContent, 'utf-8');
  }

  return {
    file,
    fixed: fileFixed,
    statistics,
    tableStatistics,
    result,
    colorScanResults,
    colorStatistics,
    errors,
  };
};

const TextScannerTools = {
  scanAndFixSCWebkitLitElement,
};

export default TextScannerTools;
