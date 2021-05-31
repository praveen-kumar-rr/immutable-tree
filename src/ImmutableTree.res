module type Tree = {
  type t
  type a
  let insert: (t, a) => t
  let search: (t, a) => option<a>
  let searchRange: (t, a, a) => array<a>
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
  let getLeft: t => option<t>
  let getRight: t => option<t>
}

module type Comparable = {
  type t
  let compare: (t, t) => int
}

module Make = (C: Comparable): (Tree with type a = C.t) => {
  type color = Red | Black
  type a = C.t
  type rec tree<'a> =
    Leaf | TreeNode(color, tree<'a>, 'a, tree<'a>) | DoubleBlack(tree<'a>, option<'a>, tree<'a>)
  type t = tree<a>
  type compareResult = EQ | GT | LT

  let comp = (a, b) => C.compare(a, b) > 0 ? GT : C.compare(a, b) < 0 ? LT : EQ

  let colorName = c =>
    switch c {
    | Red => "Red"
    | Black => "Black"
    }

  let raiseImbalance = () => "Imbalanced Tree detected"->failwith
  let createNode = (data: a) => TreeNode(Red, Leaf, data, Leaf)
  let empty = () => Leaf
  let getColor = t =>
    switch t {
    | Leaf => None
    | TreeNode(c, _, _, _) => c->colorName->Some
    | DoubleBlack(_, _, _) => raiseImbalance()
    }
  let getData = t =>
    switch t {
    | Leaf => None
    | TreeNode(_, _, d, _) => d->Some
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  /*
           Bz            Bz            Bx            Bx
          / \           / \           / \           / \
         Ry  d         Rx  d         a   Rz        a   Ry
        /  \          / \               /  \          /  \
      Rx   c         a   Ry            Ry   d        b    Rz
     /  \               /  \          / \                /  \
    a    b             b    c        b   c              c    d

    NOTE: The above diagram proves the below
    +-----------------------------+
    |  a < x < b < y < c < z < d  |
    +-----------------------------+
         Ry
        /  \
      Bx    Bz
     / \   / \
    a   b c   d
    This forms the base for below pattern matching
*/
  let balance = tree => {
    switch tree {
    | Leaf => Leaf
    | TreeNode(Black, TreeNode(Red, TreeNode(Red, a, x, b), y, c), z, d)
    | TreeNode(Black, TreeNode(Red, a, x, TreeNode(Red, b, y, c)), z, d)
    | TreeNode(Black, a, x, TreeNode(Red, TreeNode(Red, b, y, c), z, d))
    | TreeNode(Black, a, x, TreeNode(Red, b, y, TreeNode(Red, c, z, d))) =>
      TreeNode(Red, TreeNode(Black, a, x, b), y, TreeNode(Black, c, z, d))
    | TreeNode(_, _, _, _) => tree
    | DoubleBlack(_, _, _) => raiseImbalance()
    }
  }

  let rec getLeftBlackCount = (tree, c) => {
    switch tree {
    | Leaf => c
    | TreeNode(Red, l, _, _) => l->getLeftBlackCount(c)
    | TreeNode(Black, l, _, _) => l->getLeftBlackCount(c + 1)
    | DoubleBlack(_, _, _) => raiseImbalance()
    }
  }

  let rec getRightBlackCount = (tree, c) => {
    switch tree {
    | Leaf => c
    | TreeNode(Red, _, _, r) => r->getRightBlackCount(c)
    | TreeNode(Black, _, _, r) => r->getRightBlackCount(c + 1)
    | DoubleBlack(_, _, _) => raiseImbalance()
    }
  }

  let checkBlackBalance = tree => {
    let rec _checkBlackBalance = (tree, result) => {
      switch tree {
      | Leaf => result
      | TreeNode(_, l, _, r) =>
        let leftCount = tree->getLeftBlackCount(0)
        let rightCount = tree->getRightBlackCount(0)
        leftCount == rightCount && l->_checkBlackBalance(true) && r->_checkBlackBalance(true)
      | DoubleBlack(_, _, _) => raiseImbalance()
      }
    }
    tree->_checkBlackBalance(true)
  }

  let insert = (tree, value) => {
    let rec ins = t =>
      switch t {
      | Leaf => createNode(value)
      | TreeNode(c, l, d, r) =>
        switch comp(value, d) {
        | EQ => t
        | LT => TreeNode(c, ins(l), d, r)->balance
        | GT => TreeNode(c, l, d, ins(r))->balance
        }
      | DoubleBlack(_, _, _) => raiseImbalance()
      }
    switch ins(tree) {
    | TreeNode(_, l, v, r) => TreeNode(Black, l, v, r)
    | Leaf => Leaf
    | DoubleBlack(_, _, _) => raiseImbalance()
    }
  }

  let rec search = (tree, v) =>
    switch tree {
    | Leaf => None
    | TreeNode(_, l, d, r) =>
      switch comp(v, d) {
      | EQ => Some(d)
      | LT => search(l, v)
      | GT => search(r, v)
      }
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let searchRange = (tree, start, end) => {
    let rec _searchRange = (tree, start, end, acc) =>
      switch tree {
      | Leaf => acc
      | TreeNode(_, l, d, r) =>
        switch (comp(d, start), comp(d, end)) {
        | (LT, _) | (_, GT) => acc
        | (EQ, LT) | (GT, EQ) | (EQ, EQ) | (GT, LT) =>
          let leftResult = l->_searchRange(start, end, acc)
          let nextAcc = list{d, ...leftResult}
          r->_searchRange(start, end, nextAcc)
        }
      | DoubleBlack(_, _, _) => raiseImbalance()
      }
    tree->_searchRange(start, end, list{})->Belt.List.reverse->Belt.List.toArray
  }

  let rec update = (tree, old, next) =>
    switch tree {
    | Leaf => tree
    | TreeNode(c, l, d, r) =>
      switch comp(old, d) {
      | EQ => TreeNode(c, l, next, r)
      | LT => TreeNode(c, l->update(old, next), d, r)
      | GT => TreeNode(c, l, d, r->update(old, next))
      }
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let getMax = tree => {
    let rec _getMax = (tree, result) =>
      switch tree {
      | Leaf => result
      | TreeNode(_, _, d, r) =>
        switch result {
        | None | Some(_) => r->_getMax(d->Some)
        }
      | DoubleBlack(_, _, _) => raiseImbalance()
      }
    tree->_getMax(None)
  }

  let getMin = tree => {
    let rec _getMin = (tree, result) =>
      switch tree {
      | Leaf => result
      | TreeNode(_, l, d, _) =>
        switch result {
        | None | Some(_) => l->_getMin(d->Some)
        }
      | DoubleBlack(_, _, _) => raiseImbalance()
      }
    tree->_getMin(None)
  }

  let nodeFromDoubleBlack = tree =>
    switch tree {
    | DoubleBlack(l, d, r) =>
      switch d {
      | None => Leaf
      | Some(v) => TreeNode(Black, l, v, r)
      }
    | _ => tree
    }

  // a < u < b < v < c < w < d < x < e < y < f
  let rec balanceDoubleBlackNode = tree => {
    switch tree {
    | Leaf => Leaf
    // CASE 1
    //        Rv                  Bv
    //       /   \               /  \
    //     DBu     Bx          Bu    Rx
    //    /  \    /  \        / \    / \
    //   a    b  Bw   By     a   b  Bw  By
    //          / \  / \           / \  / \
    //         c  d e   f         c  d  e  f
    | TreeNode(Red, DoubleBlack(_, _, _) as db, v, Leaf) =>
      TreeNode(Black, db->nodeFromDoubleBlack, v, Leaf)
    | TreeNode(Red, DoubleBlack(_, _, _) as db, v, TreeNode(Black, Leaf, x, Leaf)) =>
      TreeNode(Black, db->nodeFromDoubleBlack, v, TreeNode(Red, Leaf, x, Leaf))
    | TreeNode(
        Red,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, Leaf, x, TreeNode(Black, e, y, f)),
      ) =>
      TreeNode(Black, db->nodeFromDoubleBlack, v, TreeNode(Red, Leaf, x, TreeNode(Black, e, y, f)))
    | TreeNode(
        Red,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, TreeNode(Black, c, w, d), x, Leaf),
      ) =>
      TreeNode(Black, db->nodeFromDoubleBlack, v, TreeNode(Red, TreeNode(Black, c, w, d), x, Leaf))
    | TreeNode(
        Red,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, TreeNode(Black, c, w, d), x, TreeNode(Black, e, y, f)),
      ) =>
      TreeNode(
        Black,
        db->nodeFromDoubleBlack,
        v,
        TreeNode(Red, TreeNode(Black, c, w, d), x, TreeNode(Black, e, y, f)),
      )
    // CASE 1 [MIRROR]
    //               Rx                      Bx
    //            /     \                   /  \
    //          Bv       DBy              Rv    By
    //        /    \     /  \            /  \    / \
    //      Bu      Bw  e   f          Bu   Bw   e  f
    //     / \     / \                / \   / \
    //    a   b   c   d              a   b c   d
    //
    | TreeNode(Red, Leaf, x, DoubleBlack(_, _, _) as db) =>
      TreeNode(Black, Leaf, x, db->nodeFromDoubleBlack)
    | TreeNode(Red, TreeNode(Black, Leaf, v, Leaf), x, DoubleBlack(_, _, _) as db) =>
      TreeNode(Black, TreeNode(Red, Leaf, v, Leaf), x, db->nodeFromDoubleBlack)
    | TreeNode(
        Red,
        TreeNode(Black, TreeNode(Black, a, u, b), v, Leaf),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(Black, TreeNode(Red, TreeNode(Black, a, u, b), v, Leaf), x, db->nodeFromDoubleBlack)
    | TreeNode(
        Red,
        TreeNode(Black, Leaf, v, TreeNode(Black, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(Black, TreeNode(Red, Leaf, v, TreeNode(Black, c, w, d)), x, db->nodeFromDoubleBlack)
    | TreeNode(
        Red,
        TreeNode(Black, TreeNode(Black, a, u, b), v, TreeNode(Black, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        Black,
        TreeNode(Red, TreeNode(Black, a, u, b), v, TreeNode(Black, c, w, d)),
        x,
        db->nodeFromDoubleBlack,
      )
    // CASE 2
    //        Bv                  Bx
    //       /   \               /  \
    //     DBu     Rx          Rv    By
    //    /  \    /  \        / \    / \
    //   a    b  Bw   By    DBu  Bw  e  f
    //          / \  / \    / \  / \
    //         c  d e   f  a   b c  d
    | TreeNode(Black, DoubleBlack(_, _, _) as db, v, TreeNode(Red, Leaf, x, Leaf)) =>
      TreeNode(Black, TreeNode(Red, db, v, Leaf)->balanceDoubleBlackNode, x, Leaf)
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Red, TreeNode(Black, c, w, d), x, Leaf),
      ) =>
      TreeNode(
        Black,
        TreeNode(Red, db, v, TreeNode(Black, c, w, d))->balanceDoubleBlackNode,
        x,
        Leaf,
      )
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Red, Leaf, x, TreeNode(Black, e, y, f)),
      ) =>
      TreeNode(
        Black,
        TreeNode(Red, db, v, Leaf)->balanceDoubleBlackNode,
        x,
        TreeNode(Black, e, y, f),
      )
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Red, TreeNode(Black, c, w, d), x, TreeNode(Black, e, y, f)),
      ) =>
      TreeNode(
        Black,
        TreeNode(Red, db, v, TreeNode(Black, c, w, d))->balanceDoubleBlackNode,
        x,
        TreeNode(Black, e, y, f),
      )
    // CASE 2 [MIRROR]
    //            Bx                 Bv
    //          /    \              /   \
    //       Rv       DBy         Bu     Rx
    //      /   \     / \        / \    /  \
    //     Bu    Bw  e   f      a   b  Bw   DBy
    //    / \    / \                  / \   / \
    //   a   b  c  d                 c   d  e  f
    | TreeNode(Black, TreeNode(Red, Leaf, v, Leaf), x, DoubleBlack(_, _, _) as db) =>
      TreeNode(Black, Leaf, v, TreeNode(Red, Leaf, x, db)->balanceDoubleBlackNode)
    | TreeNode(
        Black,
        TreeNode(Red, TreeNode(Black, a, u, b), v, Leaf),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        Black,
        TreeNode(Black, a, u, b),
        v,
        TreeNode(Red, Leaf, x, db)->balanceDoubleBlackNode,
      )
    | TreeNode(
        Black,
        TreeNode(Red, Leaf, v, TreeNode(Black, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        Black,
        Leaf,
        v,
        TreeNode(Red, TreeNode(Black, c, w, d), x, db)->balanceDoubleBlackNode,
      )
    | TreeNode(
        Black,
        TreeNode(Red, TreeNode(Black, a, u, b), v, TreeNode(Black, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        Black,
        TreeNode(Black, a, u, b),
        v,
        TreeNode(Red, TreeNode(Black, c, w, d), x, db)->balanceDoubleBlackNode,
      )
    //  CASE 3
    //       Bv                    DBv
    //     /    \                 /  \
    //   DBu     Bx             Bu    Rx
    //   / \    /  \           / \    / \
    //  a   b  Bw   By        a   b  Bw  By
    //        / \   / \             / \ / \
    //       c  d  e   f           c  d e  f
    //
    | TreeNode(Black, DoubleBlack(_, _, _) as db, v, Leaf) =>
      DoubleBlack(db->nodeFromDoubleBlack, v->Some, Leaf)
    | TreeNode(Black, DoubleBlack(_, _, _) as db, v, TreeNode(Black, Leaf, x, Leaf)) =>
      DoubleBlack(db->nodeFromDoubleBlack, v->Some, TreeNode(Red, Leaf, x, Leaf))
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, TreeNode(Black, c, w, d), x, Leaf),
      ) =>
      DoubleBlack(
        db->nodeFromDoubleBlack,
        v->Some,
        TreeNode(Red, TreeNode(Black, c, w, d), x, Leaf),
      )
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, Leaf, x, TreeNode(Black, e, y, f)),
      ) =>
      DoubleBlack(
        db->nodeFromDoubleBlack,
        v->Some,
        TreeNode(Red, Leaf, x, TreeNode(Black, e, y, f)),
      )
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, TreeNode(Black, c, w, d), x, TreeNode(Black, e, y, f)),
      ) =>
      DoubleBlack(
        db->nodeFromDoubleBlack,
        v->Some,
        TreeNode(Red, TreeNode(Black, c, w, d), x, TreeNode(Black, e, y, f)),
      )
    //  CASE 3 [MIRROR]
    //           Bx               DBx
    //         /    \            /   \
    //       Bv      DBy        Rv    By
    //     /   \     / \       /  \   / \
    //    Bu    Bw   e  f     Bu  Bw  e  f
    //   / \   /  \          / \  / \
    //   a  b  c  d         a   b c  d
    | TreeNode(Black, Leaf, x, DoubleBlack(_, _, _) as db) =>
      DoubleBlack(Leaf, x->Some, db->nodeFromDoubleBlack)
    | TreeNode(Black, TreeNode(Black, Leaf, v, Leaf), x, DoubleBlack(_, _, _) as db) =>
      DoubleBlack(TreeNode(Red, Leaf, v, Leaf), x->Some, db->nodeFromDoubleBlack)
    | TreeNode(
        Black,
        TreeNode(Black, TreeNode(Black, a, u, b), v, Leaf),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      DoubleBlack(
        TreeNode(Red, TreeNode(Black, a, u, b), v, Leaf),
        x->Some,
        db->nodeFromDoubleBlack,
      )
    | TreeNode(
        Black,
        TreeNode(Black, Leaf, v, TreeNode(Black, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      DoubleBlack(
        TreeNode(Red, Leaf, v, TreeNode(Black, c, w, d)),
        x->Some,
        db->nodeFromDoubleBlack,
      )
    | TreeNode(
        Black,
        TreeNode(Black, TreeNode(Black, a, u, b), v, TreeNode(Black, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      DoubleBlack(
        TreeNode(Red, TreeNode(Black, a, u, b), v, TreeNode(Black, c, w, d)),
        x->Some,
        db->nodeFromDoubleBlack,
      )
    // CASE 4
    //       Bv                    Bv
    //     /    \                 /  \
    //   DBu     Bx             DBu    Bw
    //   / \    /  \           / \    / \
    //  a   b  Rw   By        a   b  c   Rx
    //        / \   / \                 /  \
    //       c  d  e   f               d    By
    //                                     /  \
    //                                    e    f
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, TreeNode(Red, c, w, d), x, Leaf),
      ) =>
      TreeNode(
        Black,
        db->nodeFromDoubleBlack,
        v,
        TreeNode(Black, c, w, TreeNode(Red, d, x, Leaf)),
      )->balanceDoubleBlackNode
    | TreeNode(
        Black,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, TreeNode(Red, c, w, d), x, TreeNode(Black, e, y, f)),
      ) =>
      TreeNode(
        Black,
        db->nodeFromDoubleBlack,
        v,
        TreeNode(Black, c, w, TreeNode(Red, d, x, TreeNode(Black, e, y, f))),
      )->balanceDoubleBlackNode
    // CASE 4 [MIRROR]
    //            Bx                   Bx
    //         /     \                /  \
    //        Bv      DBy           Bw    DBy
    //      /   \     / \          / \    /  \
    //     Bu    Rw   e   f      Rv   d  e    f
    //    /  \   /  \           / \
    //   a   b   c   d         Bu  c
    //                        / \
    //                       a   b
    | TreeNode(
        Black,
        TreeNode(Black, Leaf, v, TreeNode(Red, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        Black,
        TreeNode(Black, TreeNode(Red, Leaf, v, c), w, d),
        x,
        db->nodeFromDoubleBlack,
      )->balanceDoubleBlackNode
    | TreeNode(
        Black,
        TreeNode(Black, TreeNode(Black, a, u, b), v, TreeNode(Red, c, w, d)),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        Black,
        TreeNode(Black, TreeNode(Red, TreeNode(Black, a, u, b), v, c), w, d),
        x,
        db->nodeFromDoubleBlack,
      )->balanceDoubleBlackNode
    // CASE 5
    //       Av                    Ax    (Color of v)
    //     /    \                 /  \
    //   DBu     Bx             Bv    By
    //   / \    /  \           / \    / \
    //  a   b  Aw   Ry        Bu  Aw  e  f
    //        / \   / \      / \ / \
    //       c  d  e   f    a  b c  d
    | TreeNode(
        vColor,
        DoubleBlack(_, _, _) as db,
        v,
        TreeNode(Black, wTree, x, TreeNode(Red, e, y, f)),
      ) =>
      TreeNode(
        vColor,
        TreeNode(Black, db->nodeFromDoubleBlack, v, wTree),
        x,
        TreeNode(Black, e, y, f),
      )
    // CASE 5 [MIRROR]
    // a < u < b < v < c < w < d < x < e < y < f
    //            Ax                     Av  (Color of x)
    //          /    \                  /   \
    //         Bv      DBy             Bu    Bx
    //       /   \     / \            / \    / \
    //     Ru     Aw   e   f         a   b  Aw  By
    //    / \     / \                      / \  / \
    //   a   b   c   d                    c  d  e  f
    //
    | TreeNode(
        xColor,
        TreeNode(Black, TreeNode(Red, a, u, b), v, wTree),
        x,
        DoubleBlack(_, _, _) as db,
      ) =>
      TreeNode(
        xColor,
        TreeNode(Black, a, u, b),
        v,
        TreeNode(Black, wTree, x, db->nodeFromDoubleBlack),
      )
    | _ => tree
    }
  }

  let deleteNode = (tr, v) => {
    let rec _deleteNode = (tree, v) =>
      switch tree {
      | Leaf => tree
      | TreeNode(color, l, d, r) =>
        switch comp(v, d) {
        | EQ =>
          switch r->getMin {
          | None =>
            switch l->getMax {
            // Nothing in the right and nothing in the left. This is the leaf.
            | None =>
              switch color {
              | Black => DoubleBlack(Leaf, None, Leaf)
              | Red => Leaf
              }
            | Some(maxFromLeft) =>
              TreeNode(color, l->_deleteNode(maxFromLeft), maxFromLeft, r)->balanceDoubleBlackNode
            }
          | Some(minFromRight) =>
            TreeNode(color, l, minFromRight, r->_deleteNode(minFromRight))->balanceDoubleBlackNode
          }
        | LT => TreeNode(color, l->_deleteNode(v), d, r)->balanceDoubleBlackNode
        | GT => TreeNode(color, l, d, r->_deleteNode(v))->balanceDoubleBlackNode
        }
      | DoubleBlack(_, _, _) => raiseImbalance()
      }
    switch tr->_deleteNode(v) {
    | Leaf => tr
    | TreeNode(_, l, d, r) => TreeNode(Black, l, d, r)
    | DoubleBlack(l, d, r) =>
      switch d {
      | None => Leaf
      | Some(v) => TreeNode(Black, l, v, r)
      }
    }
  }

  let rec traverseInOrder = (tree, fn, acc) =>
    switch tree {
    | Leaf => acc
    | TreeNode(_, l, d, r) =>
      let leftResult = l->traverseInOrder(fn, acc)
      let nextResult = leftResult->fn(d)
      r->traverseInOrder(fn, nextResult)
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let rec traversePreOrder = (tree, fn, acc) =>
    switch tree {
    | Leaf => acc
    | TreeNode(_, l, d, r) =>
      let nextResult = acc->fn(d)
      let leftResult = l->traversePreOrder(fn, nextResult)
      r->traversePreOrder(fn, leftResult)
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let rec traversePostOrder = (tree, fn, acc) =>
    switch tree {
    | Leaf => acc
    | TreeNode(_, l, d, r) =>
      let leftResult = l->traversePostOrder(fn, acc)
      let rightResult = r->traversePostOrder(fn, leftResult)
      rightResult->fn(d)
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let fold = traverseInOrder
  let foldLeft = traverseInOrder
  let rec foldRight = (tree, fn, acc) => {
    switch tree {
    | Leaf => acc
    | TreeNode(_, l, d, r) =>
      let rightResult = r->foldRight(fn, acc)
      let result = fn(rightResult, d)
      l->foldRight(fn, result)
    | DoubleBlack(_, _, _) => raiseImbalance()
    }
  }

  let getLeft = tree =>
    switch tree {
    | Leaf => None
    | TreeNode(_, l, _, _) => l->Some
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let getRight = tree =>
    switch tree {
    | Leaf => None
    | TreeNode(_, _, _, r) => r->Some
    | DoubleBlack(_, _, _) => raiseImbalance()
    }

  let printTreeAsc = fold(_, ((), a) => Js.log(a), ())
  let printTreeDesc = foldRight(_, ((), a) => Js.log(a), ())

  let fromArray = Js.Array.reduce((acc, a) => acc->insert(a), Leaf, _)
  let toArray = fold(_, (acc, a) => Js.Array.concat([a], acc), [])
}
