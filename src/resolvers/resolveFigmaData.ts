import { attempt, AttemptResult } from "./attempt";
import {
  ResolvedEffectStyle,
  resolveEffectStyles,
} from "./resolveEffectStyles";
import { ResolvedGridStyle, resolveGridStyles } from "./resolveGridStyles";
import { ResolvedPaintStyle, resolvePaintStyles } from "./resolvePaintStyles";
import { ResolvedTextStyle, resolveTextStyles } from "./resolveTextStyles";
import { ResolvedVariable, resolveVariables } from "./resolveVariables";

export async function resolveFigmaData(): Promise<ResolveFigmaDataResult> {
  const result = await attempt(() =>
    Promise.all([
      resolveVariables(),
      resolveTextStyles(),
      resolveEffectStyles(),
      resolvePaintStyles(),
      resolveGridStyles(),
    ])
  );

  if (result.type === "error") {
    return result;
  }

  const [variables, textStyles, effectStyles, paintStyles, gridStyles] =
    result.data;

  const data: FigmaData = {
    variables,
    textStyles,
    effectStyles,
    paintStyles,
    gridStyles,
  };

  return { ...result, data };
}

export type ResolveFigmaDataResult = AttemptResult<FigmaData>;

export interface FigmaData {
  variables: ResolvedVariable[];
  textStyles: ResolvedTextStyle[];
  effectStyles: ResolvedEffectStyle[];
  paintStyles: ResolvedPaintStyle[];
  gridStyles: ResolvedGridStyle[];
}
