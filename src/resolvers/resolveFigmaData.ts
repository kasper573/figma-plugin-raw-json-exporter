import {
  ResolvedEffectStyle,
  resolveEffectStyles,
} from "./resolveEffectStyles";
import { ResolvedGridStyle, resolveGridStyles } from "./resolveGridStyles";
import { ResolvedPaintStyle, resolvePaintStyles } from "./resolvePaintStyles";
import { ResolvedTextStyle, resolveTextStyles } from "./resolveTextStyles";
import { ResolvedVariable, resolveVariables } from "./resolveVariables";

export async function resolveFigmaData(): Promise<FigmaData> {
  const [variables, textStyles, effectStyles, paintStyles, gridStyles] =
    await Promise.all([
      resolveVariables(),
      resolveTextStyles(),
      resolveEffectStyles(),
      resolvePaintStyles(),
      resolveGridStyles(),
    ]);
  return {
    variables,
    textStyles,
    effectStyles,
    paintStyles,
    gridStyles,
  };
}

export interface FigmaData {
  variables: ResolvedVariable[];
  textStyles: ResolvedTextStyle[];
  effectStyles: ResolvedEffectStyle[];
  paintStyles: ResolvedPaintStyle[];
  gridStyles: ResolvedGridStyle[];
}
