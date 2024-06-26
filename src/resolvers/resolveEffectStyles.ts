import { Serializable } from "../types";
import { serializeBoundObject } from "./serializeBoundObject";

export async function resolveEffectStyles(): Promise<ResolvedEffectStyle[]> {
  const textNodes = await figma.getLocalEffectStylesAsync();
  return textNodes.map(resolveEffectStyle);
}

function resolveEffectStyle({
  name,
  effects,
}: EffectStyle): ResolvedEffectStyle {
  return {
    name,
    effects: effects.map(resolveEffect),
  };
}

function resolveEffect(effect: Effect): ResolvedEffect {
  switch (effect.type) {
    case "DROP_SHADOW":
      return serializeBoundObject<Serializable<DropShadowEffect>>(
        effect,
        {
          showShadowBehindNode: null,
          blendMode: null,
          visible: null,
          spread: null,
          radius: null,
          type: null,
          color: null,
          offset: null,
        },
        ["type"]
      );
    case "INNER_SHADOW":
      return serializeBoundObject<Serializable<InnerShadowEffect>>(
        effect,
        {
          blendMode: null,
          visible: null,
          spread: null,
          radius: null,
          type: null,
          color: null,
          offset: null,
        },
        ["type"]
      );
    case "LAYER_BLUR":
    case "BACKGROUND_BLUR":
      return serializeBoundObject<Serializable<BlurEffect>>(
        effect,
        {
          radius: null,
          type: null,
          visible: null,
        },
        ["type"]
      );
  }
}

export interface ResolvedEffectStyle {
  name: string;
  effects: ResolvedEffect[];
}

type ResolvedEffect = Serializable<Effect>;
