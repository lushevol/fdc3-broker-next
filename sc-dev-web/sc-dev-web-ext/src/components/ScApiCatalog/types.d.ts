
export interface ArtifactDetails {
  artifactId: string;
  name: string;
  description: string;
  groupId: string;
  artifactType: string;
  createdOn?: string;
  modifiedOn?: string;
  labels: {
    application_name: string;
    application_id: string;
    ecm_id: string;
    ecm_category: string;
    api_type: string;
    business_unit: string;
    productionized_state?: string;
    visibility_level?: string;
    spectral_linting_rank?: string;
    gateway?: string;
    external_access?: string;
  };
}

export interface ArtifactDto {
  specification: ArtifactSpecificationDto;
  contentType: string;
  versions?: {
    globalId: string;
    contentId: string;
    version: string;
    modifiedOn: string;
    createdOn: string;
    labels: {
      key: string;
      value: string;
    }[];
  }[];
  details: ArtifactDetails;
}

export interface ArtifactSpecificationDto {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: { 
    url: string;
    description: string;
    variables?: Record<string, any>;
    'x-internal'?: boolean;
  }[];
  paths: Record<string, Record<Method, ArtifactEndPt>>;
  components: Record<string, any>;
  security: Record<string, any>[];
  tags: { name: string; description: string }[];
}
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';
export interface ArtifactEndPt {
  path: string;
  method: string
  tags: string[];
  summary: string;
  description?: string;
  operationId: string;
  parameters?: {
    name: string;
    in: string;
    description: string;
    required: boolean;
    schema: Record<string, any>;
    example: string;
  }[];
  requestBody?: {
    content: Record<string, any>;
    required: boolean;
  };
  responses?: Record<string, any>;
  deprecated?: boolean;
  security?: Record<string, any>[];
}
