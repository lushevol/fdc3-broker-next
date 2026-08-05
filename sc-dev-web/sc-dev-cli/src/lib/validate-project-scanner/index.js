import { env, exit } from 'process';
import chalk from 'chalk';

import sbv01011001 from './validators/sbv-01-011-001.js';
import sbv01011002 from './validators/sbv-01-011-002.js';
import sbv01011003 from './validators/sbv-01-011-003.js';
import sbv01012001 from './validators/sbv-01-012-001.js';
import sbv01012002 from './validators/sbv-01-012-002.js';
import sbv01012003 from './validators/sbv-01-012-003.js';
import sbv01021001 from './validators/api/sbv-01-021-001.js';
import sbv01021002 from './validators/api/sbv-01-021-002.js';
import sbv01021004 from './validators/api/sbv-01-021-004.js';
import sbv01021006 from './validators/api/sbv-01-021-006.js';
import sbv01021007 from './validators/api/sbv-01-021-007.js';
import sbv01021008 from './validators/api/sbv-01-021-008.js';
import sbv01021009 from './validators/api/sbv-01-021-009.js';
import sbv01022001 from './validators/api/sbv-01-022-001.js';
import sbv01022002 from './validators/api/sbv-01-022-002.js';
import sbv01022003 from './validators/api/sbv-01-022-003.js';
import sbv01022004 from './validators/api/sbv-01-022-004.js';
import sbv01022005 from './validators/api/SBV-01-022-005.js';
import sbv01025001 from './validators/api/sbv-01-025-001.js';
import sbv01025002 from './validators/api/sbv-01-025-002.js';

export const SEVERITY = {
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW'
}

const commonPluginValidators = [
    sbv01011001,
    sbv01011002,
    sbv01011003,
    sbv01012001,
    sbv01012002,
    sbv01012003,
];

const commonApiValidators = [
    sbv01021001,
    sbv01021002,
    sbv01021004,
    sbv01021006,
    sbv01021007,
    sbv01021008,
    sbv01021009,
    sbv01022001,
    sbv01022002,
    sbv01022003,
    sbv01022004,
    sbv01022005,
    sbv01025001,
    sbv01025002,
];

// Register project validators here
const validators = {
    'service-bench-plugin-lit': [
        ...commonPluginValidators
    ],
    'service-bench-plugin-lit-ts': [
        ...commonPluginValidators
    ],
    'service-bench-plugin-react': [
        ...commonPluginValidators
    ],    
    'service-bench-process-api-java': [
        ...commonApiValidators
    ],
    'service-bench-process-api-kotlin': [
        ...commonApiValidators
    ],
    'service-bench-experience-api-java': [
        ...commonApiValidators
    ],
    'service-bench-experience-api-kotlin': [
        ...commonApiValidators
    ],
    'service-bench-batch-job-java': [
        ...commonApiValidators
    ],
    'service-bench-mcp-process-api-java': [
        ...commonApiValidators
    ],
    'service-bench-mcp-process-api-kotlin': [
        ...commonApiValidators
    ],
    'service-bench-mcp-process-api-java-native': [
        ...commonApiValidators
    ],
    'service-bench-mcp-process-api-kotlin-native': [
        ...commonApiValidators
    ]
};

const printValidatorResult = (result) => {
    const formatterResult = result.map((item) => {
        const resultItem = { ...item };
        if (resultItem.severity === SEVERITY.HIGH) {
            resultItem.severity = chalk.redBright`[${resultItem.severity}]`;
        } else if (resultItem.severity === SEVERITY.MEDIUM) {
            resultItem.severity = chalk.yellowBright`[${resultItem.severity}]`;
        } else if (resultItem.severity === SEVERITY.LOW) {
            resultItem.severity = chalk.blueBright`[${resultItem.severity}]`;
        } else {
            resultItem.severity = `[${resultItem.severity || '?'}]`
        }
        return resultItem;
    });
    formatterResult.forEach((item) => {
        console.log(`${item.severity} ${chalk.bold.whiteBright`${item.id || '-'}`} ${item.name || '-'}`);
        console.log(`${chalk.cyanBright`Path:`} ${item.path || '(unknown)'}`);
        if (item.messages) {
            item.messages.forEach((message) => {
                console.log(`- ${message}`);
            });
        }
        console.log('');
    });
}

const printValidatorSummary = (result) => {
    const severityMap = result.reduce((map, item) => {
        const severity = item.severity;
        if (!map[severity]) {
            map[severity] = 0;
        };
        map[severity] = map[severity] + 1;
        return map;
    }, {});
    const highSeverityCount = severityMap[SEVERITY.HIGH] || 0;
    const mediumSeverityCount = severityMap[SEVERITY.MEDIUM] || 0;
    const lowSeverityCount = severityMap[SEVERITY.LOW] || 0;
    console.log(chalk.whiteBright`Validation Result Summary:`);
    if (highSeverityCount > 0) {
        console.log(chalk.redBright`- Found ${highSeverityCount} high severity issue. Release build will fail until they are fixed.`);
    } else {
        console.log(chalk.greenBright`- Found ${highSeverityCount} high severity issue.`);
    }
    if (mediumSeverityCount > 0) {
        console.log(chalk.yellowBright`- Found ${mediumSeverityCount} medium severity issue. Please fix them as soon as possible.`);
    } else {
        console.log(chalk.greenBright`- Found ${mediumSeverityCount} medium severity issue.`);
    }
    if (lowSeverityCount > 0) {
        console.log(chalk.blueBright`- Found ${lowSeverityCount} low severity issue.`);
    } else {
        console.log(chalk.greenBright`- Found ${lowSeverityCount} low severity issue.`);
    }
    return {
        severity: {
            high: highSeverityCount,
            medium: mediumSeverityCount,
            low: lowSeverityCount
        }
    }
}

const HIGH_SEVERITY_THRESHOLD = 0;
const EXCLUDED_REPOS = [];

const validateResult = (severity) => {
    const { high: highSeverityCount } = severity;
    
    let isRunOnProtectedBranch = false;
    if (env['BUILD_SOURCEBRANCH']) {
        const sourceBranch = env['BUILD_SOURCEBRANCH'];
        if (sourceBranch.startsWith('refs/heads/main') || sourceBranch.startsWith('refs/heads/release') || sourceBranch.startsWith('refs/heads/catalyst')) {
            isRunOnProtectedBranch = true;
        }
    }

    let isRepoExcludedFromValidation = false;
    if (env['BUILD_REPOSITORY_NAME']) {
        const repositoryName = env['BUILD_REPOSITORY_NAME'];
        if (EXCLUDED_REPOS.includes(repositoryName)) {
            isRepoExcludedFromValidation = true;
        }
    }

    let failSeverityThreshold = false;
    if (highSeverityCount > HIGH_SEVERITY_THRESHOLD) {
        failSeverityThreshold = true;
    }

    // Build failure
    if (isRunOnProtectedBranch 
        && !isRepoExcludedFromValidation 
        && failSeverityThreshold) {
        console.log('');
        console.error(chalk.redBright`Build fails due to project validation check.`)
        exit(1);
    }
}

export const ScanValidateProjectMixin = (subclass) =>
  class extends subclass {
    name() {
      return 'Validate Project Scanner';
    }
    async execute() {
        await super.execute();

        const projectValidators = validators[this.templateData.cliType];
        if (!projectValidators) {
            console.log('');
            console.error(chalk.red`Unable to proceed with validation. Current project type validation is not supported yet.`);
            exit();
        } else {
            console.log(this.templateData.cliType);
            console.log(`Found ${projectValidators.length} validator${projectValidators.length > 1 ? 's' : ''}.`);
            console.log('')
        }

        const promises = projectValidators.map((validator) => validator({ data: this.templateData, pathResolver: this.destinationPath.bind(this) }));
        const output = await Promise.all(promises);
        const result = output.flat();
        printValidatorResult(result);
        const { severity } = printValidatorSummary(result);
        validateResult(severity);

    }

  };
