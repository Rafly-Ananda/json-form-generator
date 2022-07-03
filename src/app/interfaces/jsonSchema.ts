export interface JSONSchemaProps {
  [key: string]: string;
}

export interface JSONSchema {
  id?: number;
  schemaName: string;
  schemaDescription: string;
  properties: {
    [key: string]: JSONSchemaProps;
  };
  schemas: JSONSchemaProps[];
  required?: string[];
  createdAt?: string;
}
