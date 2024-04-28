import { DiscriminatedValue, discriminateValue } from "./resolveVariables";

/**
 * Automatically resolves bound variables in an object.
 *
 * Notes on the implementation:
 *
 * Figmas data structure unfortunately does not seem to support enumeration, so we can't automatically serialize objects.
 * So instead we utilize typescript to force us to provide all keys of the object we want to resolve.
 * This will ensure that we are always resolving all known properties of the object.
 * This makes it easier to maintain if the object structure changes.
 */
export function serializeBoundObject<T>(
  source: T & { readonly boundVariables?: BoundVariables<T> },
  template: Template<T>,
  useRawValueForTheseProps: Array<keyof T> = []
): T {
  const resolved = {} as T;

  for (const key of Object.keys(template)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (source as any)[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolved as any)[key] = useRawValueForTheseProps.includes(key as keyof T)
      ? value
      : serializeValue(value);
  }

  if (source.boundVariables) {
    for (const [key, alias] of Object.entries(source.boundVariables)) {
      (resolved as Record<string, unknown>)[key] = discriminateValue(
        alias as VariableAlias
      );
    }
  }

  return resolved;
}

function serializeValue(value: unknown): SerializedValue {
  const discriminated = discriminateValue(value);
  if (discriminated) {
    return discriminated;
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value === null || value === undefined) {
    return value;
  }

  const serializedProperties: SerializedValueRecord = {};
  for (const [propertyName, propertyValue] of Object.entries(value)) {
    serializedProperties[propertyName] = serializeValue(propertyValue);
  }
  return serializedProperties;
}

type SerializedValue =
  | null
  | undefined
  | DiscriminatedValue
  | SerializedValue[]
  | SerializedValueRecord;

type SerializedValueRecord = { [key: string]: SerializedValue };

type BoundVariables<T> = {
  [K in keyof T]?: VariableAlias;
};

type Template<T> = {
  [K in keyof T]: null;
};
