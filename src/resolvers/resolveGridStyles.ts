import { Serializable } from "../types";
import { serializeBoundObject } from "./serializeBoundObject";

export async function resolveGridStyles(): Promise<ResolvedGridStyle[]> {
  const textNodes = await figma.getLocalGridStylesAsync();
  return textNodes.map(resolveGridStyle);
}

function resolveGridStyle({
  name,
  layoutGrids: grids,
}: GridStyle): ResolvedGridStyle {
  return {
    name,
    grids: grids.map(resolveGrid),
  };
}

function resolveGrid(grid: LayoutGrid): ResolvedGrid {
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
