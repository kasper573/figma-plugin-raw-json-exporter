import { Serializable } from "../types";
import { serializeBoundObject } from "./serializeBoundObject";

export async function resolveTextStyles(): Promise<ResolvedTextStyle[]> {
  const textNodes = await figma.getLocalTextStylesAsync();
  return Promise.all(textNodes.map(resolveTextStyle));
}

async function resolveTextStyle(style: TextStyle): Promise<ResolvedTextStyle> {
  const resolved = serializeBoundObject<Omit<ResolvedTextStyle, "name">>(
    style,
    {
      remote: null,
      description: null,
      textCase: null,
      hangingList: null,
      hangingPunctuation: null,
      listSpacing: null,
      paragraphSpacing: null,
      paragraphIndent: null,
      leadingTrim: null,
      lineHeight: null,
      textDecoration: null,
      fontSize: null,
      type: null,
      fontName: null,
      letterSpacing: null,
    }
  );

  return {
    ...resolved,
    name: style.name,
  };
}

export type ResolvedTextStyle = Omit<Serializable<TextStyle>, "id" | "key">;
