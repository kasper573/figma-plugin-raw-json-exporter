import { Serializable } from "../types";
import { serializeBoundObject } from "./serializeBoundObject";

export async function resolveEffectStyles(): Promise<ResolvedEffectStyle[]> {
  const textNodes = await figma.getLocalEffectStylesAsync();
  return Promise.all(textNodes.map(resolveEffectStyle));
}

async function resolveEffectStyle({
  name,
  effects,
}: EffectStyle): Promise<ResolvedEffectStyle> {
  return {
    name,
    effects: await Promise.all(effects.map(resolveEffect)),
  };
}

function resolveEffect(effect: Effect): Promise<ResolvedEffect> {
  switch (effect.type) {
    case "DROP_SHADOW":
      return serializeBoundObject<Serializable<DropShadowEffect>>(effect, {
        showShadowBehindNode: null,
        blendMode: null,
        visible: null,
        spread: null,
        radius: null,
        type: null,
        color: null,
        offset: null,
      });
    case "INNER_SHADOW":
      return serializeBoundObject<Serializable<InnerShadowEffect>>(effect, {
        blendMode: null,
        visible: null,
        spread: null,
        radius: null,
        type: null,
        color: null,
        offset: null,
      });
    case "LAYER_BLUR":
    case "BACKGROUND_BLUR":
      return serializeBoundObject<Serializable<BlurEffect>>(effect, {
        radius: null,
        type: null,
        visible: null,
      });
  }
}

export interface ResolvedEffectStyle {
  name: string;
  effects: ResolvedEffect[];
}

type ResolvedEffect = Serializable<Effect>;
