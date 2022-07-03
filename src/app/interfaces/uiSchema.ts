export interface UISchema {
  type: string;
  elements: Array<object>;
}

export interface UISchemaElements {
  type: string;
  scope: string;
  label: string;
  options?: { [key: string]: string } | string;
}
