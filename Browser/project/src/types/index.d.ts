/// <reference types="vite/client"/>

// generic utils
export type AllOptional<T> = { [Property in keyof T]?: T[Property] };
export type CreateGetters<T> = {
  [Property in keyof T as `get${Capitalize<
    string & Property
  >}`]: () => T[Property];
};
export type CreateImmutable<T> = {
  +readonly [Property in keyof T]: T[Property];
};
export type CreateMutable<T> = { -readonly [Property in keyof T]: T[Property] };
export type NonNullable<T> = T extends null | undefined ? never : T;
export type OneOrMany<T> = T | T[];
export type OneOrManyOrNull<T> = OrNull<OneOrMany<T>>;
export type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
export type OrNull<T> = T | null;
export type OrUndefined<T> = T | undefined;
export type StringKeys<T> = keyof T;
export type StringMap<T> = { [P in keyof T]: string };
export type ValidateEnum<SourceOfTruth, TypeOfEnum> = Extract<
  SourceOfTruth,
  keyof TypeOfEnum
>;

// helpers
export type ParamsOfFunctionType<F> = ThisParameterType<F>; // USAGE: const fncParams:ParamsOfFunctionType<typeof myFunction>
export type RealParamsOfFunctionType<F> = NonNullable<ParamsOfFunctionType<F>>;

// scoped generics
export type ErrorNotificationType<T> = { response: { data: Partial<T> } };

declare global {
  interface KeyValueObjectType {
    [k: string]: any;
  }
  interface KeyValueGenericType<T> {
    [k: string]: T;
  }
}

export interface KeyValueObjectType {
  [k: string]: any;
}
export interface KeyValueGenericType<T> {
  [k: string]: T;
}

export type CookieType = {
  constructor(value: T);

  get AllAvailable(): string | null;
  get Named(): (string) => string | null;
  get node(): T;
  get parent(): T | null;
  get grandparent(): T | null;
  get isInArray(): boolean;
  get siblings(): T[] | null;
  get next(): T | null;
  get previous(): T | null;
  get isFirst(): boolean;
  get isLast(): boolean;
  get isRoot(): boolean;
  get root(): T;
  get ancestors(): T[];

  stack: T[];

  callParent<U>(callback: (path: this) => U, count?: number): U;

  getName(): PropertyKey | null;

  getValue(): T;

  getNode(count?: number): T | null;

  getParentNode(count?: number): T | null;

  match(
    ...predicates: Array<
      (node: any, name: string | null, number: number | null) => boolean
    >
  ): boolean;
};
