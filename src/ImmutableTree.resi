module type Tree = {
  type t
  type a
  let insert: (t, a) => t
  let search: (t, a) => option<a>
  let deleteNode: (t, a) => t
  let update: (t, a, a) => t
  let printTreeAsc: t => unit
  let printTreeDesc: t => unit
  let checkBlackBalance: t => bool
  let getColor: t => option<string>
  let getData: t => option<a>
  let getMin: t => option<a>
  let getMax: t => option<a>
  let fromArray: array<a> => t
  let toArray: t => array<a>
  let traverseInOrder: (t, ('a, a) => 'a, 'a) => 'a
  let traversePreOrder: (t, ('a, a) => 'a, 'a) => 'a
  let traversePostOrder: (t, ('a, a) => 'a, 'a) => 'a
  let fold: (t, ('a, a) => 'a, 'a) => 'a
  let foldLeft: (t, ('a, a) => 'a, 'a) => 'a
  let foldRight: (t, ('a, a) => 'a, 'a) => 'a
  let empty: unit => t
}

module type Comparable = {
  type t
  let compare: (t, t) => int
}

module Make: (C: Comparable) => (Tree with type a = C.t)
