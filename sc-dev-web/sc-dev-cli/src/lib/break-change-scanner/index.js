import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { eachLimit } from 'async';
import { exec } from 'child_process';
import { promisify } from 'util';
import CodeScannerTools from './scanner.js';
import TextScannerTools from './scanner-text.js';
import { startLog, logMessage } from './log.js';

const asyncExec = promisify(exec);

const traverseDirectorySync = (directory) => {
  const filePaths = [];
  function traverse(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        traverse(filePath);
      } else {
        if (/\.(js|ts|jsx|tsx)$/.test(filePath)) {
          filePaths.push(filePath);
        }
      }
    });
  }
  traverse(directory);
  return filePaths;
};

const updateScWebkitVersion = async () => {
  let res = true;
  const cmd = 'npm install @scdevkit/webkit@latest';
  console.log(chalk.bgGreen('[Auto run] ' + cmd), '\n');
  try {
    const { stdout, stderr } = await asyncExec(cmd);
    console.log(stdout);
    if (stderr) {
      console.error(chalk.red(`${cmd} failed, please run the command manually~`));
      console.error(stderr);
      return false;
    }
  } catch (err) {
    console.error(chalk.red(`${cmd} failed, please run the command manually~`));
    logMessage(`${cmd} failed, please run the command manually~`);
    return false;
  }
  return true;
};

export const ScanBreakChangeMixin = (subclass) =>
  class extends subclass {
    name() {
      return 'Break Change Scanner';
    }
    async execute() {
      await super.execute();

      const { sbUpdateTargetDir, cliType } = this.templateData;
      const targetDir = sbUpdateTargetDir || './src/';
      if (cliType === 'scan-webkit-break-change') {
        startLog('webkit-version-scanner');
        let allPaths = traverseDirectorySync(targetDir);
        allPaths = allPaths.filter((p) => !/node_modules/.test(p));

        allPaths.forEach((path, idx) => {
          idx === 0 && logMessage('------------all paths------------');
          logMessage(path);
        });

        const allInOne = [];
        const statistics = {
          toChangedFile: 0,
          canAutoFixCode: 0,
          needManuallyFixCode: 0,
          toChangedCode: 0,
          errorFile: 0,
          errorCode: 0,
          toChangedColors: 0,
          canAutoFixColor: 0,
          needManuallyFixColor: 0,
          fixedColorCount: 0,
          unfixedColorCount: 0,
          fixedCount: 0,
          unfixedCount: 0,
        };
        const tableStatistics = {
          canAutoFixCode: 0,
          needManuallyFixCode: 0,
          toChangedCode: 0,
          fixedCount: 0,
          unfixedCount: 0,
        }

        await eachLimit(allPaths, 1, async (uri, cb) => {
          const res = await TextScannerTools.scanAndFixSCWebkitLitElement(uri);

          allInOne.push(res);
          if (res.result.length || res.colorScanResults.length) {
            statistics.toChangedFile++;
          }
          // table only
          tableStatistics.canAutoFixCode += res.tableStatistics.canAuto;
          tableStatistics.needManuallyFixCode += res.tableStatistics.needManual;
          tableStatistics.toChangedCode += res.tableStatistics.canAuto + res.tableStatistics.needManual;

          statistics.canAutoFixCode += res.statistics.canAuto;
          statistics.needManuallyFixCode += res.statistics.needManual;
          statistics.toChangedCode += res.statistics.canAuto + res.statistics.needManual;
          statistics.canAutoFixColor += res.colorStatistics.canAuto;
          statistics.needManuallyFixColor += res.colorStatistics.needManual;
          statistics.toChangedColors +=
            res.colorStatistics.canAuto + res.colorStatistics.needManual;
          if (res.errors.length) {
            statistics.errorFile++;
            statistics.errorCode += res.errors.length;
          }

          let hasTitle = false;
          res.result.forEach((item, idx) => {
            if (idx === 0) {
              hasTitle = true;
              logMessage(`\n--------------------process file--------------------\n${res.file}\n`);
            }
            item.tip && logMessage(item.tip);
          });
          res.errors?.forEach((item, idx) => {
            if (!hasTitle && idx === 0) {
              hasTitle = true;
              logMessage(`\n--------------------process file--------------------\n${res.file}\n`);
            }
            logMessage(item.tip);
            logMessage(item.erro?.message || '');
          });

          cb?.();
        });

        if (statistics.toChangedColors) {
          console.log(`\n\n
--------------------${chalk.bgYellow('Color Variables')}--------------------
To get new colors in Doc: https://servicebench-dev.global.standardchartered.com/sc-webkit/storybook/index.html?path=/story/colors-colors--all \n
          `);
          logMessage(
            `\n\n
--------------------Color Variables--------------------
To get new colors in Doc: https://servicebench-dev.global.standardchartered.com/sc-webkit/storybook/index.html?path=/story/colors-colors--all \n
          `,
          );
          allInOne.forEach((i) => {
            i.colorScanResults.forEach((item) => {
              if (item.tip) {
                console.log(item.tip, '\n');
                logMessage(item.tip);
              }
            });
          });
        }

        console.log(`\n\n
====================${chalk.bgGreenBright('Scanning Results')}====================\n
Number of Scanned Files: ${chalk.green(allPaths.length)}
Number of Affected Files: ${chalk.blue(statistics.toChangedFile)}; 
Number of Attribute Changes: ${chalk.blue(statistics.toChangedCode)} (can auto-fix: ${chalk.blue(
          statistics.canAutoFixCode,
        )} / need manual-fix: ${chalk.yellow(statistics.needManuallyFixCode)});
Number of Table Attribute Changes: ${chalk.blue(tableStatistics.toChangedCode)} (can auto-fix: ${chalk.blue(
          tableStatistics.canAutoFixCode,
        )} / need manual-fix: ${chalk.yellow(tableStatistics.needManuallyFixCode)});
Number of Color Variables changes: ${chalk.yellow(
          statistics.toChangedColors,
        )} (can auto-fix: ${chalk.blue(
          statistics.canAutoFixColor,
        )} / need manual-fix: ${chalk.yellow(statistics.needManuallyFixColor)});
Number of Parsed Error Files: ${chalk.red(statistics.errorFile)},
Number of Error Code Templates: ${chalk.red(statistics.errorCode)},
Please check them manually.
        `);
        logMessage(
          `\n\n
====================Scanning Results====================\n
Number of Scanned Files: ${allPaths.length},
Number of Affected Files: ${statistics.toChangedFile}; 
Number of Attribute Changes: ${chalk.blue(statistics.toChangedCode)} (can auto-fix: ${chalk.blue(
            statistics.canAutoFixCode,
          )} / need manual-fix: ${chalk.yellow(statistics.needManuallyFixCode)});
Number of Table Attribute Changes: ${chalk.blue(tableStatistics.toChangedCode)} (can auto-fix: ${chalk.blue(
            tableStatistics.canAutoFixCode,
          )} / need manual-fix: ${chalk.yellow(tableStatistics.needManuallyFixCode)});
Number of Color Variables changes: ${chalk.yellow(
            statistics.toChangedColors,
          )} (can auto-fix: ${chalk.blue(
            statistics.canAutoFixColor,
          )} / need manual-fix: ${chalk.yellow(statistics.needManuallyFixColor)});
Number of Parsed Error Files: ${statistics.errorFile},
Number of Error Code Templates: ${statistics.errorCode},
Please check them manually.
        `,
        );

        // start to auto-fix
        const fixOptions = await prompts([
          {
            type: 'select',
            name: 'fixMethod',
            message: 'Which fix method do you prefer?',
            choices: [
              {
                title: 'Auto-fix (automatically update @scdevkit/webkit to the latest version)',
                value: 'auto-fix',
              },
              {
                title: 'Auto migrate the sc-table to data grid',
                value: 'fix-table-only',
              },
              { title: 'Manually-fix', value: 'manually-fix' },
            ],
          },
          // {
          //   type: (prev) => (prev === 'manually-fix' ? 'select' : null),
          //   name: 'autoUpdateWebkit',
          //   message: 'Do you want to install the latest SC Webkit version?',
          //   choices: [
          //     { title: 'Yes, Please help me update @scdevkit/webkit.', value: true },
          //     { title: "No, I'll update it by myself.", value: false },
          //   ],
          // },
        ]);

        // if (fixOptions.fixMethod === 'auto-fix' || fixOptions.autoUpdateWebkit) {
        //   await updateScWebkitVersion();
        // }
        if (fixOptions.fixMethod === 'auto-fix' || fixOptions.fixMethod === 'fix-table-only') {
          console.log(
            `\n\n\n====================${chalk.bgGreen(
              'Start to Auto-Fix...',
            )}====================\n`,
          );
          logMessage(
            `\n\n\n====================${chalk.bgGreen(
              'Start to Auto-Fix...',
            )}====================\n`,
          );

          const fixColorResultList = [];

          await eachLimit(allInOne, 1, async (item, cb) => {
            const {
              result,
              statistics: resStatistics,
              tableStatistics: tableStatisticsOutputOfFix,
              colorStatistics,
              colorScanResults,
              file,
              fixed,
            } = await TextScannerTools.scanAndFixSCWebkitLitElement(item.file, 'auto-fix', fixOptions.fixMethod === 'fix-table-only');
            result?.forEach((item, idx) => {
              item.tip && logMessage(item.tip);
              if (idx === result.length - 1) {
                console.log(
                  `\n[${
                    fixed ? chalk.bgGreen('Auto-Fixed Done') : chalk.bgYellow('Unfixed')
                  }] (fixed: ${chalk.green(resStatistics.fixed)} / unfixed: ${chalk.yellow(
                    resStatistics.unfixed,
                  )}) ${file}\n`,
                );
                logMessage(
                  `\n[${fixed ? 'Auto-Fixed Done' : 'Unfixed'}] (fixed: ${
                    resStatistics.fixed
                  } / unfixed: ${resStatistics.unfixed}) ${file}\n`,
                );
              }
            });
            // table only
            tableStatistics.fixedCount += tableStatisticsOutputOfFix.fixed;
            tableStatistics.unfixedCount += tableStatisticsOutputOfFix.unfixed;

            statistics.fixedCount += resStatistics.fixed;
            statistics.unfixedCount += resStatistics.unfixed;
            statistics.fixedColorCount += colorStatistics.fixed;
            statistics.unfixedColorCount += colorStatistics.unfixed;
            fixColorResultList.push(colorScanResults);
            cb?.();
          });

          if (statistics.fixedColorCount + statistics.unfixedColorCount > 0) {
            console.log(`\n\n
--------------------${chalk.bgYellow('Color Variables')}--------------------
To get new colors in Doc: https://servicebench-dev.global.standardchartered.com/sc-webkit/storybook/index.html?path=/story/colors-colors--all \n
          `);
            logMessage(
              `\n\n
--------------------Color Variables--------------------
To get new colors in Doc: https://servicebench-dev.global.standardchartered.com/sc-webkit/storybook/index.html?path=/story/colors-colors--all \n
          `,
            );
            fixColorResultList.forEach((i) => {
              i.forEach((item) => {
                if (item.tip) {
                  console.log(item.tip, '\n');
                  logMessage(item.tip);
                }
              });
            });
          }

          console.log(
            `\n\n
====================${chalk.bgGreenBright('Auto-Fixing Results')}====================\n
[TABLE] Number of Auto-Fixed changes: ${chalk.green(tableStatistics.fixedCount)};
[TABLE] Number of Unfixed changes: ${chalk.blue(tableStatistics.unfixedCount)}; 
[NON-TABLE] Number of Auto-Fixed changes: ${chalk.green(statistics.fixedCount)};
[NON-TABLE] Number of Unfixed changes: ${chalk.blue(statistics.unfixedCount)}; 
Number of Auto-Fixed Color Variables: ${statistics.fixedColorCount};
Number of Unfixed Color Variables: ${statistics.unfixedColorCount};
Please check them carefully.
        \n\n`,
          );
          logMessage(
            `\n\n
====================Auto-Fixing Results====================\n
[TABLE] Number of Auto-Fixed changes: ${chalk.green(tableStatistics.fixedCount)};
[TABLE] Number of Unfixed changes: ${chalk.blue(tableStatistics.unfixedCount)}; 
[NON-TABLE] Number of Auto-Fixed changes: ${chalk.green(statistics.fixedCount)};
[NON-TABLE] Number of Unfixed changes: ${chalk.blue(statistics.unfixedCount)}; 
Number of Auto-Fixed Color Variables: ${statistics.fixedColorCount};
Number of Unfixed Color Variables: ${statistics.unfixedColorCount};
Please check them carefully.
        \n\n`,
          );
        }

        setTimeout(() => {
          process.exit();
        }, 200);
      }
    }
  };
