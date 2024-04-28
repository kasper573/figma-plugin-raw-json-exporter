import { discriminateVariableValue } from "./resolveVariables";

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
export async function resolveBoundObject<T>(
  source: T & { readonly boundVariables?: BoundVariables<T> },
  template: Template<T>
): Promise<T> {
  const resolved = {} as T;

  for (const key of Object.keys(template)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolved as any)[key] = (source as any)[key];
  }

  if (source.boundVariables) {
    for (const [key, alias] of Object.entries(source.boundVariables)) {
      (resolved as Record<string, unknown>)[key] = discriminateVariableValue(
        alias as VariableAlias
      );
    }
  }

  return resolved;
}

type BoundVariables<T> = {
  [K in keyof T]?: VariableAlias;
};

type Template<T> = {
  [K in keyof T]: null;
};
