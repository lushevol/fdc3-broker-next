/// <reference types="react-scripts" />
/// <reference path="../../typings/index.d.ts" />

interface LocalFilter {
  conditions: {
    field: string;
    regExp: string;
  }[];
}
