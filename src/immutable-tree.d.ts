type Tree<T> = {};

export type Comparable<T> = (a: T, b: T) => number;

export class ImmutableTree<T> {
  constructor(comp: Comparable<T>, node?: Tree<T>);
  insert: (t: T) => ImmutableTree<T>;
  search: (t: T) => T | undefined;
  searchRange: (t1: T, t2: T) => T[];
  deleteNode: (t: T) => ImmutableTree<T>;
  update: (a: T, b: T) => ImmutableTree<T>;
  printTreeAsc: () => void;
  printTreeDesc: () => void;
  getColor: () => "Black" | "Red" | undefined;
  getData: () => T | undefined;
  getMin: () => T | undefined;
  getMax: () => T | undefined;
  toArray: () => T[];
  traverseInOrder<A>(f: (a: A, t: T) => A, i: A): A;
  traversePreOrder<A>(f: (a: A, t: T) => A, i: A): A;
  traversePostOrder<A>(f: (a: A, t: T) => A, i: A): A;
  fold<A>(f: (a: A, t: T) => A, i: A): A;
  foldLeft<A>(f: (a: A, t: T) => A, i: A): A;
  foldRight<A>(f: (a: A, t: T) => A, i: A): A;
  getLeft(): ImmutableTree<T> | undefined;
  getRight(): ImmutableTree<T> | undefined;
}

export function fromArray<T>(comp: Comparable<T>, array: T[]): ImmutableTree<T>;
