import { ConditionalPickDeep, Primitive } from "type-fest";

export type Serializable<T> = ConditionalPickDeep<T, SerializableLike>;

type SerializableLike = Primitive | readonly SerializableLike[];
