let timeIt = (fn, ~message=?, ()) => {
  let start = Js.Date.now()
  let result = fn()

  let m = switch message {
  | None => "Total time taken is : "
  | Some(m) => `Total time taken for ${m} is : `
  }

  Js.log(`${m} ${(Js.Date.now() -. start)->Belt.Float.toString}ms`)
  result
}

let test = (name, fn) => {
  Js.log2("-- Started :", name)
  try {
    fn()->ignore
    Js.log(`-- ${name} SUCCESS`)
  } catch {
  | e =>
    Js.log(`-- ${name} FAILED`)
    Js.log(e)
  }
}

module FloatTree = ImmutableTree.Make({
  type t = float
  let compare = compare
})

module IntTree = ImmutableTree.Make({
  type t = int
  let compare = compare
})

type person = {
  id: int,
  name: string,
}

module PersonTree = ImmutableTree.Make(
  {
    type t = person
    let compare = (a, b) => compare(a.id, b.id)
  }: ImmutableTree.Comparable with type t = person,
)

"Test Huge Tree"->test(() => {
  open FloatTree

  // Building Tree and asserting balance
  let rec buildHugeTree = (root, a, current, total) =>
    current > total
      ? root
      : {
          let next = root->insert(a +. 1.)
          assert (next->checkBlackBalance)
          buildHugeTree(next, a +. 1., current +. 1., total)
        }

  let root = timeIt(
    () => empty()->buildHugeTree(1., 0., 10000.),
    ~message="Creation of huge tree",
    (),
  )

  // Searching Tree
  let result = timeIt(() => root->search(10000.), ~message="Search of huge tree", ())
  assert (result == Some(10000.))

  // Deleting Tree and asserting balance
  let rec deleteHugeTree = (root, a, current, total) =>
    current > total
      ? root
      : {
          let next = root->deleteNode(a +. 1.)
          assert (next->checkBlackBalance)
          deleteHugeTree(next, a +. 1., current +. 1., total)
        }

  timeIt(() => root->deleteHugeTree(0., 0., 10000.), ~message="Deletion of huge tree", ())->ignore
})

"Array Test"->test(() => {
  open IntTree

  let expectedBalancedTree = empty()->IntTree.insert(1)->IntTree.insert(2)->IntTree.insert(3)
  assert (fromArray([1, 2, 3]) == expectedBalancedTree)
  assert (fromArray([1, 2, 3])->IntTree.toArray == [1, 2, 3])
})

"Insert Test"->test(() => {
  open FloatTree

  assert (empty()->insert(1.)->toArray == [1.])
  assert (empty()->insert(1.)->insert(2.)->toArray == [1., 2.])
})

"Delete Test"->test(() => {
  open FloatTree

  let tree = empty()->insert(1.)->insert(2.)->insert(3.)
  let tree2 = tree->insert(4.)->insert(5.)->insert(6.)

  assert (tree2->deleteNode(2.)->search(2.) == None)
  assert (empty()->deleteNode(2.)->search(2.) == None)
  assert (tree2->deleteNode(2.)->search(3.) == Some(3.))
  assert (tree->deleteNode(2.)->toArray == [1., 3.])
})

"Min Max Test"->test(() => {
  open FloatTree

  let tree = fromArray([1., 2., 3., 4., 5., 6.])

  assert (tree->getMin == Some(1.))
  assert (tree->getMax == Some(6.))
})

"Fold Test"->test(() => {
  open FloatTree

  let arr = [1., 2., 3., 4., 5., 6.]
  let tree = fromArray(arr)
  let reduceToArray = (acc, a) => Js.Array.concat([a], acc)

  assert (tree->fold(reduceToArray, []) == arr)
  assert (tree->foldRight(reduceToArray, []) == arr->Belt.Array.reverse)
})

"Object data test"->test(() => {
  open PersonTree

  let arjun = {id: 1, name: "Arjun"}
  let chris = {id: 3, name: "Chris"}
  let benjamin = {id: 2, name: "Benjamin"}
  let arr = [arjun, benjamin, chris]
  let tree = arr->fromArray

  assert (tree->search(arjun) == Some(arjun))
  assert (tree->deleteNode(arjun)->search(arjun) == None)
  assert (tree->getMin == Some(arjun))
  assert (tree->getMax == Some(chris))
  assert (tree->getData == Some(benjamin))
  assert (empty()->getData == None)
})

"Update test"->test(() => {
  open PersonTree

  let arjun = {id: 1, name: "Arjun"}
  let chris = {id: 3, name: "Chris"}
  let benjamin = {id: 3, name: "Benjamin"}
  let arr = [arjun, chris]
  let tree = arr->fromArray

  assert (tree->update(chris, benjamin)->search(chris) == Some(benjamin))
  assert (tree->update(chris, benjamin)->search(benjamin) == Some(benjamin))
  assert (tree->search(benjamin) == Some(chris))
  assert (empty()->update(chris, benjamin)->search(chris) == None)
})

"Traversal Test"->test(() => {
  open FloatTree

  let arr = [1., 2., 3., 4., 5.]
  let result = arr->fromArray->traverseInOrder((acc, d) => Js.Array.concat([d], acc), [])
  assert (result == arr)

  let result = arr->fromArray->traversePreOrder((acc, d) => Js.Array.concat([d], acc), [])
  assert (result == [2., 1., 4., 3., 5.])

  let result = arr->fromArray->traversePostOrder((acc, d) => Js.Array.concat([d], acc), [])
  assert (result == [1., 3., 5., 4., 2.])
})

"Range search test"->test(() => {
  open FloatTree

  let tree = fromArray([1., 2., 3., 4., 5.])

  assert (tree->searchRange(2., 5.) == [2., 3., 4., 5.])
  assert (tree->searchRange(-1., 2.) == [1., 2.])
  assert (tree->searchRange(-10., 10.) == [1., 2., 3., 4., 5.])
  assert (tree->searchRange(-10., -3.) == [])
  assert (tree->searchRange(6., 10.) == [])
})

"Basic operations test"->test(() => {
  open IntTree

  let flatMap = Belt.Option.flatMap
  let tree = fromArray([1, 2, 3])

  assert (tree->getData == 2->Some)
  assert (tree->getLeft->flatMap(getData) == 1->Some)
  assert (tree->getRight->flatMap(getData) == 3->Some)
  assert (tree->getRight->flatMap(getRight)->flatMap(getData) == None)
  assert (tree->getRight->flatMap(getLeft)->flatMap(getData) == None)
  assert (tree->getLeft->flatMap(getLeft)->flatMap(getData) == None)
  assert (tree->getLeft->flatMap(getRight)->flatMap(getData) == None)
  assert (tree->getLeft->flatMap(getRight)->flatMap(getRight) == None)
  assert (tree->getLeft->flatMap(getLeft)->flatMap(getRight) == None)
  assert (tree->getRight->flatMap(getRight)->flatMap(getLeft) == None)
  assert (tree->getRight->flatMap(getLeft)->flatMap(getLeft) == None)

  assert (fromArray([])->getHeight == 0)
  assert (fromArray([1])->getHeight == 1)
  assert (fromArray([1, 2, 3])->getHeight == 2)
  assert (fromArray([1, 2, 3, 4, 5])->getHeight == 3)

  assert (fromArray([])->getLength == 0)
  assert (fromArray([1])->getLength == 1)
  assert (fromArray([1, 2, 3])->getLength == 3)
  assert (fromArray([1, 2, 3, 4, 5])->getLength == 5)
  assert (fromArray([1, 2, 3, 4, 5])->getLeft->Belt.Option.map(getLength) == 1->Some)
})
