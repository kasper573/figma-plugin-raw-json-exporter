export async function resolveVariables(): Promise<ResolvedVariable[]> {
  const variables = await figma.variables.getLocalVariablesAsync();
  return Promise.all(variables.map(resolveVariable));
}

async function resolveVariable(variable: Variable): Promise<ResolvedVariable> {
  const collection = await requireCollection(variable.variableCollectionId);

  const serializedValuePairPromises: Array<Promise<[string, unknown]>> = [];

  for (const mode of collection.modes) {
    if (mode.modeId in variable.valuesByMode) {
      serializedValuePairPromises.push(
        resolveVariableValue(variable.valuesByMode[mode.modeId]).then(
          (serialized) => [mode.name, serialized]
        )
      );
    }
  }

  const [reference, valueModePairs] = await Promise.all([
    createVariableReference(variable, collection),
    Promise.all(serializedValuePairPromises),
  ]);

  return {
    name: reference,
    type: variable.resolvedType,
    valuesByMode: Object.fromEntries(valueModePairs),
  };
}

export async function resolveVariableValue(value: VariableValue) {
  return isAlias(value) ? resolveVariableAlias(value) : value;
}

export async function resolveVariableAlias(value: VariableAlias) {
  const variable = await requireVariable(value.id);
  const collection = await requireCollection(variable.variableCollectionId);
  const reference = createVariableReference(variable, collection);
  return `{${reference}}`;
}

function createVariableReference(
  variable: Variable,
  collection: VariableCollection
) {
  return `${collection.name}/${variable.name}`;
}

function isAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    "type" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}

export interface ResolvedVariable {
  name: string;
  type: string;
  valuesByMode: Record<string, unknown>;
}

async function requireVariable(id: string): Promise<Variable> {
  const variable = await figma.variables.getVariableByIdAsync(id);
  if (!variable) {
    throw new Error(`Could not resolve variable with id ${id}`);
  }
  return variable;
}

async function requireCollection(id: string): Promise<VariableCollection> {
  const collection = await figma.variables.getVariableCollectionByIdAsync(id);
  if (!collection) {
    throw new Error(`Could not resolve collection with id ${id}`);
  }
  return collection;
}
