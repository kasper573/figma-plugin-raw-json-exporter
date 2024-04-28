import { Serializable } from "../types";
import { serializeBoundObject } from "./serializeBoundObject";

export async function resolveGridStyles(): Promise<ResolvedGridStyle[]> {
  const textNodes = await figma.getLocalGridStylesAsync();
  return Promise.all(textNodes.map(resolveGridStyle));
}

async function resolveGridStyle({
  name,
  layoutGrids: grids,
}: GridStyle): Promise<ResolvedGridStyle> {
  return {
    name,
    grids: await Promise.all(grids.map(resolveGrid)),
  };
}

async function resolveGrid(grid: LayoutGrid): Promise<ResolvedGrid> {
  return serializeBoundObject<Serializable<LayoutGrid>>(grid, {
    alignment: null,
    count: null,
    gutterSize: null,
    pattern: null,
    offset: null,
    sectionSize: null,
    visible: null,
  });
}

export interface ResolvedGridStyle {
  name: string;
  grids: ResolvedGrid[];
}

type ResolvedGrid = Serializable<LayoutGrid>;
