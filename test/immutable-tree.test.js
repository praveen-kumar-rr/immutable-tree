const { ImmutableTree, fromArray } = require('../src/immutable-tree.js');
const { strict: assert } = require('assert');

const test = (name, fn) => {
    console.log(`-- Started ${name}`);
    try {
        fn();
        console.log(`-- ${name} SUCCESS`);
    } catch (e) {
        console.log(`-- ${name} FAIL`);
        console.log(e);
    }
};


test('Tree operations', () => {
    const strCat = (a, b) => `${a}${b}`;
    const compare = (a, b) => a - b;
    const treeFromArray = fromArray(compare, [10, 20, 30]);

    assert.deepEqual(
        new ImmutableTree(compare).insert(2).insert(3).insert(4).insert(5).toArray(),
        [2, 3, 4, 5]
    );
    assert.deepEqual(treeFromArray.toArray(), [10, 20, 30]);
    assert.equal(treeFromArray.search(20), 20);
    assert.equal(treeFromArray.getMin(), 10);
    assert.equal(treeFromArray.getMax(), 30);
    assert.equal(treeFromArray.search(100), undefined);
    assert.deepEqual(treeFromArray.deleteNode(10).toArray(), [20, 30]);
    assert.deepEqual(treeFromArray.deleteNode(100).toArray(), [10, 20, 30]);
    assert.equal(treeFromArray.getColor(), 'Black');
    assert.equal(treeFromArray.getData(), 20);

    assert.equal(treeFromArray.getLeft().getData(), 10);
    assert.equal(treeFromArray.getRight().getData(), 30);
    assert.equal(treeFromArray.getRight().getLeft(), undefined);
    assert.equal(treeFromArray.getRight().getRight(), undefined);
    assert.equal(treeFromArray.getLeft().getRight(), undefined);
    assert.equal(treeFromArray.getLeft().getLeft(), undefined);

    assert.equal(treeFromArray.fold(strCat, ''), '102030');
    assert.equal(treeFromArray.foldLeft(strCat, ''), '102030');
    assert.equal(treeFromArray.foldRight(strCat, ''), '302010');

    // Insertion did not affect existing tree
    assert.deepEqual(treeFromArray.insert(40).toArray(), [10, 20, 30, 40]);
    assert.notDeepEqual(treeFromArray, [10, 20, 30, 40]);

    // Update for single value makes no sense
    assert.notEqual(treeFromArray.update(10, 100).search(100), 100);
    // Here 100 cannot be equal to 10. So the update never happened
    assert.notEqual(treeFromArray.update(10, 100).search(10), 10);

    assert.equal(fromArray(compare, []).getHeight(), 0)
    assert.equal(fromArray(compare, [1]).getHeight(), 1)
    assert.equal(fromArray(compare, [1, 2, 3]).getHeight(), 2)
    assert.equal(fromArray(compare, [1, 2, 3, 4, 5]).getHeight(), 3)

    assert.equal(fromArray(compare, []).getLength(), 0)
    assert.equal(fromArray(compare, [1]).getLength(), 1)
    assert.equal(fromArray(compare, [1, 2, 3]).getLength(), 3)
    assert.equal(fromArray(compare, [1, 2, 3, 4, 5]).getLength(), 5)
    assert.equal(fromArray(compare, [1, 2, 3, 4, 5]).getLeft().getLength(), 1)
});

test('Update operation', () => {
    const compare = (a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
    const arjun = { id: 1, name: 'Arjun' };
    const benjamin = { id: 2, name: 'Benjamin' };
    const chris = { id: 2, name: 'Chris' };

    const personArray = [arjun, benjamin];
    const tree = fromArray(compare, personArray);

    assert.deepEqual(tree.toArray(), personArray);
    assert.deepEqual(tree.update(benjamin, chris).search(chris), chris);
    assert.deepEqual(tree.update(benjamin, chris).search(benjamin), chris);
    assert.deepEqual(tree.search(chris), benjamin);
});

test('Traverse tests', () => {
    const compare = (a, b) => a - b;
    const treeFromArray = fromArray(compare, [1, 2, 3, 4, 5]);

    const concatArray = (acc, a) => [...acc, a];

    assert.deepEqual(treeFromArray.traverseInOrder(concatArray, []), [1, 2, 3, 4, 5]);
    assert.deepEqual(treeFromArray.traversePreOrder(concatArray, []), [2, 1, 4, 3, 5]);
    assert.deepEqual(treeFromArray.traversePostOrder(concatArray, []), [1, 3, 5, 4, 2]);
});

test('Range search tests', () => {
    const compare = (a, b) => a - b;
    const treeFromArray = fromArray(compare, [1, 2, 3, 4, 5]);

    assert.deepEqual(treeFromArray.searchRange(2, 5), [2, 3, 4, 5]);
    assert.deepEqual(treeFromArray.searchRange(-1, 2), [1, 2]);
    assert.deepEqual(treeFromArray.searchRange(-10, 10), [1, 2, 3, 4, 5]);
    assert.deepEqual(treeFromArray.searchRange(-10, -3), []);
    assert.deepEqual(treeFromArray.searchRange(6, 10), []);
});

test('Raw traversal test', () => {
    const compare = (a, b) => a - b;
    const treeFromArray = fromArray(compare, [1, 2, 3, 4, 5]);

    // Mutating pre order traversal
    const results = [];
    const rawPreOrderTraversal = (t) => {
        t.getData() && results.push(t.getData())
        t.getLeft() && rawPreOrderTraversal(t.getLeft());
        t.getRight() && rawPreOrderTraversal(t.getRight());
    }
    rawPreOrderTraversal(treeFromArray);

    const concatArray = (acc, a) => [...acc, a];
    const traverseResults = treeFromArray.traversePreOrder(concatArray, []);

    assert.deepEqual(results, traverseResults);
});