import { Serializable } from "../types";
import { resolveBoundObject } from "./resolveBoundObject";

export async function resolvePaintStyles(): Promise<ResolvedPaintStyle[]> {
  const textNodes = await figma.getLocalPaintStylesAsync();
  return Promise.all(textNodes.map(resolvePaintStyle));
}

async function resolvePaintStyle({
  name,
  paints,
}: PaintStyle): Promise<ResolvedPaintStyle> {
  return {
    name,
    paints: await Promise.all(paints.map(resolvePaint)),
  };
}

async function resolvePaint(paint: Paint): Promise<ResolvedPaint> {
  switch (paint.type) {
    case "GRADIENT_ANGULAR":
    case "GRADIENT_DIAMOND":
    case "GRADIENT_LINEAR":
    case "GRADIENT_RADIAL": {
      const gradientStops = paint.gradientStops.map((stop) =>
        resolveBoundObject<Serializable<ColorStop>>(stop, {
          color: null,
          position: null,
        })
      );

      const resolved = await resolveBoundObject<Serializable<GradientPaint>>(
        paint,
        {
          gradientTransform: null,
          type: null,
          blendMode: null,
          opacity: null,
          visible: null,
        }
      );

      return { ...resolved, gradientStops } as unknown as ResolvedPaint;
    }
    case "IMAGE":
      return resolveBoundObject<Serializable<ImagePaint>>(paint, {
        imageHash: null,
        scaleMode: null,
        type: null,
        blendMode: null,
        imageTransform: null,
        opacity: null,
        rotation: null,
        scalingFactor: null,
        visible: null,
      });
    case "SOLID":
      return resolveBoundObject<Serializable<SolidPaint>>(paint, {
        type: null,
        blendMode: null,
        opacity: null,
        visible: null,
        color: null,
      });
    case "VIDEO":
      return resolveBoundObject<Serializable<VideoPaint>>(paint, {
        scaleMode: null,
        type: null,
        videoHash: null,
        blendMode: null,
        opacity: null,
        rotation: null,
        scalingFactor: null,
        videoTransform: null,
        visible: null,
      });
  }
}

export interface ResolvedPaintStyle {
  name: string;
  paints: ResolvedPaint[];
}

type ResolvedPaint = Serializable<Paint>;
