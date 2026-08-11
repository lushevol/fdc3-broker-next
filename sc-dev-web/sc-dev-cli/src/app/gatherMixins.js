import { CommonMixin } from '../generators/common/index.js';
import { ServiceBenchTestPlaywright } from '../generators/service-bench-test-playwright/index.js';
import { AIAgentSkillMixin } from '../generators/ai-agent-skill/index.js';
import { FaasJavaQuarkus } from '../generators/faas-java-quarkus/index.js';
import { WebkitDemoReact } from '../generators/webkit-demo-react/index.js';
import { WebkitDemoAngular } from '../generators/webkit-demo-angular/index.js';
import { WebkitBasic } from '../generators/webkit-basic/index.js';
import { WebkitBasicReact } from '../generators/webkit-basic-react/index.js';
import { WebkitBasicLit } from '../generators/webkit-basic-lit/index.js';
import { ServiceBenchPluginLit } from '../generators/service-bench-plugin-lit/index.js';
import { ServiceBenchPluginLitTypeScript } from '../generators/service-bench-plugin-lit-ts/index.js';
import { ServiceBenchWidgetLitTypeScript } from '../generators/service-bench-widget-lit-ts/index.js';
import { ServiceBenchPluginReact } from '../generators/service-bench-plugin-react/index.js';
import { ServiceBenchExperienceApiKotlin } from '../generators/service-bench-experience-api-kotlin/index.js';
import { ServiceBenchExperienceApiJava } from '../generators/service-bench-experience-api-java/index.js';
import { ServiceBenchProcessApiJava } from '../generators/service-bench-process-api-java/index.js';
import { ServiceBenchMcpApiJava } from '../generators/service-bench-mcp-api-java/index.js';
import { ServiceBenchMcpApiJavaNative } from '../generators/service-bench-mcp-api-java-native/index.js';
import { ServiceBenchProcessApiKotlin } from '../generators/service-bench-process-api-kotlin/index.js';
import { ServiceBenchMcpApiKotlin } from '../generators/service-bench-mcp-api-kotlin/index.js';
import { ServiceBenchMcpApiKotlinNative } from '../generators/service-bench-mcp-api-kotlin-native/index.js';
import { ServiceBenchBatchJobJava } from '../generators/service-bench-batch-job-java/index.js';
import { ServiceBenchBatchJobPython } from '../generators/service-bench-batch-job-python/index.js';
import { ServiceBenchProcessApiNodeJS } from '../generators/service-bench-process-api-nodejs/index.js';
import { ServiceBenchExperienceApiNodeJS } from '../generators/service-bench-experience-api-nodejs/index.js';
import { ServiceBenchMcpApiNodeJS } from '../generators/service-bench-mcp-api-nodejs/index.js';
import { GenericProcessApiJavaQuarkusGenerate } from '../generators/generic-process-api-java-quarkus/generate.js';
import { GenericProcessApiJavaQuarkusDryRun } from '../generators/generic-process-api-java-quarkus/dryRun.js';
import { GenericProcessApiJavaQuarkusResync } from '../generators/generic-process-api-java-quarkus/resync.js';
import { ServiceBenchNotification } from '../generators/service-bench-notification/index.js';
import { ScanBreakChangeMixin } from '../lib/break-change-scanner/index.js';
import { ScanValidateProjectMixin } from '../lib/validate-project-scanner/index.js';
import {ServiceBenchExperienceApiPython} from "../generators/service-bench-experience-api-python/index.js";
import {ServiceBenchProcessApiPython} from "../generators/service-bench-process-api-python/index.js";
import {ServiceBenchProcessApiGolang} from "../generators/service-bench-process-api-golang/index.js";
import { ServiceBenchMcpApiGolang } from '../generators/service-bench-mcp-api-golang/index.js';
import {ServiceBenchExperienceApiGolang} from "../generators/service-bench-experience-api-golang/index.js";
import {ServiceBenchMcpApiPython} from "../generators/service-bench-mcp-api-python/index.js";
import { ServiceBenchTemporalLpp } from '../generators/service-bench-temporal-lpp/index.js';
import { ServiceBenchTemporal } from '../generators/service-bench-temporal/index.js';


export function gatherMixins(options) {
  const mixins = [];

  if (options.action === 'validate') {
    mixins.push(ScanValidateProjectMixin);
    return mixins;
  }

  switch (options.type) {
    case 'generic-process-api-java-quarkus':
      if (options.action === 'create') {
        mixins.push(GenericProcessApiJavaQuarkusGenerate);
      } else if (options.openapiAction === 'dry-run') {
        mixins.push(GenericProcessApiJavaQuarkusDryRun);
      } else {
        mixins.push(GenericProcessApiJavaQuarkusResync);
      }
      break;
    case 'faas-java-quarkus':
      mixins.push(FaasJavaQuarkus);
      break;
    case 'webkit-demo-react':
      mixins.push(WebkitDemoReact);
      break;
    case 'webkit-demo-angular':
      mixins.push(WebkitDemoAngular);
      break;
    case 'webkit-basic':
      mixins.push(WebkitBasic);
      break;
    case 'webkit-basic-react':
      mixins.push(WebkitBasicReact);
      break;
    case 'webkit-basic-lit':
      mixins.push(WebkitBasicLit);
      break;
    case 'service-bench-plugin-lit':
      mixins.push(ServiceBenchPluginLit);
      break;
    case 'service-bench-plugin-lit-ts':
      mixins.push(ServiceBenchPluginLitTypeScript);
      break;
    case 'service-bench-plugin-react':
      mixins.push(ServiceBenchPluginReact);
      break;
    case 'service-bench-widget-lit-ts':
      mixins.push(ServiceBenchWidgetLitTypeScript);
      break;
    case 'service-bench-experience-api-kotlin':
      mixins.push(ServiceBenchExperienceApiKotlin);
      break;
    case 'service-bench-experience-api-java':
      mixins.push(ServiceBenchExperienceApiJava);
      break;
    case 'service-bench-process-api-java':
      mixins.push(ServiceBenchProcessApiJava);
      break;
    case 'service-bench-process-api-kotlin':
      mixins.push(ServiceBenchProcessApiKotlin);
      break;
    case 'service-bench-batch-job-java':
      mixins.push(ServiceBenchBatchJobJava);
      break;
    case 'service-bench-batch-job-python':
      mixins.push(ServiceBenchBatchJobPython);
      break;
    case 'service-bench-experience-api-nodejs':
      mixins.push(ServiceBenchExperienceApiNodeJS);
      break;
    case 'service-bench-process-api-nodejs':
      mixins.push(ServiceBenchProcessApiNodeJS);
      break;
    case 'service-bench-mcp-api-nodejs':
      mixins.push(ServiceBenchMcpApiNodeJS);
      break;
    case 'service-bench-notification':
      mixins.push(ServiceBenchNotification);
      break;
    case 'scan-webkit-break-change':
      mixins.push(ScanBreakChangeMixin);
      break;
    case 'ai-agent-skill':
      mixins.push(AIAgentSkillMixin);
      break;
    case 'service-bench-experience-api-python':
      mixins.push(ServiceBenchExperienceApiPython);
      break;
    case 'service-bench-process-api-python':
      mixins.push(ServiceBenchProcessApiPython);
      break;
    case 'service-bench-process-api-golang':
      mixins.push(ServiceBenchProcessApiGolang);
      break;
    case 'service-bench-experience-api-golang':
      mixins.push(ServiceBenchExperienceApiGolang);
      break;
    case 'service-bench-mcp-process-api-golang':
      mixins.push(ServiceBenchMcpApiGolang);
      break;
    case 'service-bench-mcp-process-api-java':
      mixins.push(ServiceBenchMcpApiJava);
      break;
    case 'service-bench-mcp-process-api-java-native':
      mixins.push(ServiceBenchMcpApiJavaNative);
      break;
    case 'service-bench-mcp-process-api-kotlin':
      mixins.push(ServiceBenchMcpApiKotlin);
      break;
    case 'service-bench-mcp-process-api-kotlin-native':
      mixins.push(ServiceBenchMcpApiKotlinNative);
      break;
    case 'service-bench-mcp-api-python':
      mixins.push(ServiceBenchMcpApiPython);
      break;
    case 'service-bench-test-playwright':
      mixins.push(ServiceBenchTestPlaywright);
      break;
    case 'service-bench-temporal-lpp':
      mixins.push(ServiceBenchTemporalLpp);
      break;
    case 'service-bench-temporal':
      mixins.push(ServiceBenchTemporal);
      break;
    default:
      mixins.push(CommonMixin);
  }

  return mixins;
}
