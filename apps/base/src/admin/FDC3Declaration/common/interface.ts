import type { Context } from '@finos/fdc3';
import type { AdminModuleProps } from '../../common/interface';
import type { JSONSchema7 } from 'json-schema';
import { AppDefinition } from 'ratan-fdc3-app-directory';

export interface FDC3DeclarationProps extends AdminModuleProps {}

export interface FDC3IntentDefinition {
  name: string;
  description: string;
}

export interface FDC3ContextDefinition {
  schema: JSONSchema7;
  description?: string;
  samples?: Context[];
}

export interface FDC3Interop {
  intents: {
    listensFor: NonNullable<AppDefinition['interop']['intents']>['listensFor'];
    raises?: NonNullable<AppDefinition['interop']['intents']>['raises'];
  };
  userChannels?: string[];
}

export interface FDC3DeclarationData {
  appId: string;
  interop: FDC3Interop;
}
