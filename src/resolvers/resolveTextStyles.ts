import { Serializable } from "../types";
import { resolveBoundObject } from "./resolveBoundObject";

export async function resolveTextStyles(): Promise<ResolvedTextStyle[]> {
  const textNodes = await figma.getLocalTextStylesAsync();
  return Promise.all(textNodes.map(resolveTextStyle));
}

async function resolveTextStyle(style: TextStyle): Promise<ResolvedTextStyle> {
  return resolveBoundObject<ResolvedTextStyle>(style, {
    remote: null,
    description: null,
    name: null,
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
  });
}

export type ResolvedTextStyle = Omit<Serializable<TextStyle>, "id" | "key">;
