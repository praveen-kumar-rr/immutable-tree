# Immutable Tree

Immutable, fully persistent, and balanced binary search tree data structure implementation in pure js.

- Can run in browser and nodejs environments.
- Can be used in js, ts and rescript projects.

Tests available! Time complexity for insertion, deletion and search is `O(log n)` since this is an implementation of Red Black Tree.

### Installation

- For JS and TS projects
  - `npm i @rpkumar/immutable-tree --save`
- For Rescript project
  - `npm i @rpkumar/immutable-tree --save`
  - Update bs-dependencies in bsconfig.json
    - `"bs-dependencies": ["@rpkumar/immutable-tree"]`
    - Ensure you clean build your rescript project

### Usage in JS

```javascript
import { fromArray, ImmutableTree } from "@rpkumar/immutable-tree";

const compare = (a, b) => a - b;

// Create tree
new ImmutableTree(compare);

// Create from array of values
fromArray(compare, [1, 2, 3]);

// Chainable
new ImmutableTree(compare)
  .insert(1)
  .insert(2)
  .insert(3)
  .insert(6)
  .deleteNode(2)
  .printTreeAsc(); // Print in ascending order
```

### Usage in TS

```typescript
import { fromArray, ImmutableTree } from "@rpkumar/immutable-tree";

const compare = (a: number, b: number) => a - b;

// Create tree
new ImmutableTree<number>(compare);

// Create from array of values
fromArray<number>(compare, [1, 2, 3]);

// Chainable
new ImmutableTree<number>(compare)
  .insert(1)
  .insert(2)
  .insert(3)
  .insert(6)
  .deleteNode(2)
  .printTreeAsc(); // Print in ascending order
```

### Usage in Rescript

```ocaml
module FloatTree = ImmutableTree.Make({
  type t = float
  let compare = compare
})

FloatTree.empty()
->FloatTree.insert(1.)
->FloatTree.insert(2.)
->FloatTree.insert(3.)
->FloatTree.insert(6.)
->FloatTree.deleteNode(2.)
->FloatTree.printTreeAsc

open FloatTree
fromArray([10., 20., 30., 40.])->printTreeDesc
```

## API :

_insert_:  
 Insert element into the tree

_search_:  
 Search for an element

_searchRange_:  
 Search for all the elements in a particular range. Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_deleteNode_:  
 Delete node from tree

_update_:  
 Update an element based on the provided `compare` function

_printTreeAsc_:  
 Prints the data in the tree in `ascending` order

_printTreeDesc_:  
 Prints the data in the tree in `descending` order

_getMin_:  
 Get the minimum value from the tree

_getMax_:  
 Get the maximum value from the tree

_fromArray_:  
 Create tree from a given array

_toArray_:  
 Convert to array from tree

_traverseInOrder_:  
 Does `In Order` Traversal on the tree . Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_traversePreOrder_:  
 Does `Pre Order` Traversal on the tree . Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_traversePostOrder_:  
 Does `Post Order` Traversal on the tree . Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_fold_:  
 fold on values of the tree in `ascending` order. Similar to `reduce` function for arrays. Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_foldLeft_:  
 An alias for the `fold` function. Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_foldRight_:  
 fold on values of the tree in `descending` order. Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_empty_:  
 Creates an empty node

_getLeft_:  
 Gets left tree of current tree node. This can be used to perform raw iteration over the tree. Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

_getRight_:  
 Gets right tree of current tree node. This can be used to perform raw iteration over the tree. Check [tests](https://github.com/praveen-kumar-rr/immutable-tree/tree/main/test) for usage.

---

## How does Immutable Tree work?

Immutable tree is a fully persistent, balanced, _functional_ binary search tree data structure. It is an immutable Red Black Tree. This means, tree is never modified or updated during any operation. Only a new tree is created with nodes either added or removed.

Well, then is it cloning the entire tree? That must be consuming high memory right? The answer is, _No_. Immutable Tree, optimally reuses the untouched nodes and creates new nodes necessary only for the path accessed by the current operation. Lets see an example.

### Insertion :

Check the below image. Consider that we want to insert a new value **2.5** to the tree **A**. Tree **A** is not directly modified or updated but a new series of nodes are created while traversing from the root to the node where the insertion has happened while still reusing the existing nodes (here node **1** and all its children).

![Immutable Tree Insertion](https://github.com/praveen-kumar-rr/readme-images/blob/main/immutable-tree-insert.jpg?raw=true)

### Deletion :

Consider that we want to delete a value **4** from the tree **A**. Tree **A** is not directly modified or updated but again a new series of nodes are created while traversing from the root to the node that has to be deleted, while still reusing the existing nodes (here node **1** and all its children).

![Immutable Tree Deletion](https://github.com/praveen-kumar-rr/readme-images/blob/main/immutable-tree-delete.jpg?raw=true)

### Why Immutable Tree?

Well it has all benefits as any other immutable data structure.

- Easy to reason about the code and maintain
- Can be reused with out the fear of modification
- Time travelling
- Write pure, side effect free functions

**Note :**
Internal representation of the tree might not be readable. So for logging the tree, please use the in built functions like `printTreeAsc` or `printTreeDesc`.
