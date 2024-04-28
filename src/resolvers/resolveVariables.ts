export async function resolveVariables(): Promise<ResolvedVariable[]> {
  const variables = await figma.variables.getLocalVariablesAsync();
  return Promise.all(variables.map(resolveVariable));
}

async function resolveVariable(variable: Variable): Promise<ResolvedVariable> {
  const collection = await requireCollection(variable.variableCollectionId);

  const valuesByMode = Object.fromEntries(
    collection.modes.map((mode) => [
      mode.name,
      discriminateVariableValue(variable.valuesByMode[mode.modeId]),
    ])
  );

  return {
    id: variable.id,
    name: variable.name,
    collection: collection.name,
    valuesByMode,
  };
}

export function discriminateVariableValue(
  value: VariableValue
): DiscriminatedValue {
  switch (typeof value) {
    case "string":
      return { type: "string", value };
    case "number":
      return { type: "number", value };
    case "boolean":
      return { type: "boolean", value };
    case "object":
      if ("type" in value) {
        return { type: "alias", id: value.id };
      }
      if ("a" in value) {
        return { type: "rgba", ...value };
      }
      return { type: "rgb", ...value };
  }
}

export type DiscriminatedValue =
  | { type: "alias"; id: VariableAlias["id"] }
  | { type: "boolean"; value: boolean }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | ({ type: "rgba" } & RGBA)
  | ({ type: "rgb" } & RGB);

export interface ResolvedVariable {
  id: string;
  name: string;
  collection: string;
  valuesByMode: Record<string, DiscriminatedValue>;
}

async function requireCollection(id: string): Promise<VariableCollection> {
  const collection = await figma.variables.getVariableCollectionByIdAsync(id);
  if (!collection) {
    throw new Error(`Could not resolve collection with id ${id}`);
  }
  return collection;
}
