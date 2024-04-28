import { ZodType, z } from "zod";

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

export function discriminateValue(
  value: unknown
): DiscriminatedValue | undefined {
  switch (typeof value) {
    case "string":
      return { type: "string", value };
    case "number":
      return { type: "number", value };
    case "boolean":
      return { type: "boolean", value };
    case "object": {
      const alias = aliasSchema.safeParse(value);
      if (alias.success) {
        return { type: "alias", id: alias.data.id };
      }
      const rgba = rgbaSchema.safeParse(value);
      if (rgba.success) {
        return { type: "rgba", ...rgba.data };
      }
      const rgb = rgbSchema.safeParse(value);
      if (rgb.success) {
        return { type: "rgb", ...rgb.data };
      }
      break;
    }
  }
}

export function discriminateVariableValue(
  value: VariableValue
): DiscriminatedValue {
  const discriminated = discriminateValue(value);
  if (!discriminated) {
    throw new Error(`Could not discriminate value ${value}`);
  }
  return discriminated;
}

const aliasSchema: ZodType<VariableAlias> = z.object({
  type: z.literal("VARIABLE_ALIAS"),
  id: z.string(),
});

const rgbaSchema: ZodType<RGBA> = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  a: z.number(),
});

const rgbSchema: ZodType<RGB> = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
});

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
