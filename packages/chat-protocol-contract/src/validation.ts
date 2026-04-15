import type { ChatRunRequest, ChatStreamFrame } from './types';
import { chatRunRequestSchema, chatStreamFrameSchema } from './schemas';

export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationFailure = {
  success: false;
  errors: string[];
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

function formatIssues(error: {
  issues: Array<{ path: Array<string | number>; message: string }>;
}): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
    return path + ': ' + issue.message;
  });
}

export function validateRunRequest(input: unknown): ValidationResult<ChatRunRequest> {
  const result = chatRunRequestSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: formatIssues(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function validateStreamFrame(input: unknown): ValidationResult<ChatStreamFrame> {
  const result = chatStreamFrameSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: formatIssues(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
