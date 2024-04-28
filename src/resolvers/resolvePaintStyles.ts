import { Serializable } from "../types";
import { serializeBoundObject } from "./serializeBoundObject";

export async function resolvePaintStyles(): Promise<ResolvedPaintStyle[]> {
  const textNodes = await figma.getLocalPaintStylesAsync();
  return textNodes.map(resolvePaintStyle);
}

function resolvePaintStyle({ name, paints }: PaintStyle): ResolvedPaintStyle {
  return {
    name,
    paints: paints.map(resolvePaint),
  };
}

function resolvePaint(paint: Paint): ResolvedPaint {
  switch (paint.type) {
    case "GRADIENT_ANGULAR":
    case "GRADIENT_DIAMOND":
    case "GRADIENT_LINEAR":
    case "GRADIENT_RADIAL": {
      // TODO fix gradient stops, they don't seem to be exporting anything
      const gradientStops = paint.gradientStops.map((stop) =>
        serializeBoundObject<Serializable<ColorStop>>(stop, {
          color: null,
          position: null,
        })
      );

      const resolved = serializeBoundObject<Serializable<GradientPaint>>(
        paint,
        {
          gradientTransform: null,
          type: null,
          blendMode: null,
          opacity: null,
          visible: null,
        },
        ["type"]
      );

      return { ...resolved, gradientStops } as unknown as ResolvedPaint;
    }
    case "IMAGE":
      return serializeBoundObject<Serializable<ImagePaint>>(
        paint,
        {
          imageHash: null,
          scaleMode: null,
          type: null,
          blendMode: null,
          imageTransform: null,
          opacity: null,
          rotation: null,
          scalingFactor: null,
          visible: null,
        },
        ["type"]
      );
    case "SOLID":
      return serializeBoundObject<Serializable<SolidPaint>>(
        paint,
        {
          type: null,
          blendMode: null,
          opacity: null,
          visible: null,
          color: null,
        },
        ["type"]
      );
    case "VIDEO":
      return serializeBoundObject<Serializable<VideoPaint>>(
        paint,
        {
          scaleMode: null,
          type: null,
          videoHash: null,
          blendMode: null,
          opacity: null,
          rotation: null,
          scalingFactor: null,
          videoTransform: null,
          visible: null,
        },
        ["type"]
      );
  }
}

export interface ResolvedPaintStyle {
  name: string;
  paints: ResolvedPaint[];
}

type ResolvedPaint = Serializable<Paint>;
