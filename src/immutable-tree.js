const immutableTree = require("./ImmutableTree.bs.js");

class ImmutableTree {
  _immTree;
  _root;
  _comp;

  constructor(comp, node) {
    this._comp = comp;
    this._immTree = immutableTree.Make({ compare: comp });
    this._root = node || this._immTree.empty();
  }

  insert(t) {
    return new ImmutableTree(this._comp, this._immTree.insert(this._root, t));
  }

  search(t) {
    return this._immTree.search(this._root, t);
  }

  searchWithDefault(t, v) {
    return this._immTree.searchWithDefault(this._root, t, v);
  }

  searchRange(t1, t2) {
    return this._immTree.searchRange(this._root, t1, t2);
  }

  deleteNode(t) {
    return new ImmutableTree(
      this._comp,
      this._immTree.deleteNode(this._root, t)
    );
  }

  update(old, next) {
    return new ImmutableTree(
      this._comp,
      this._immTree.update(this._root, old, next)
    );
  }

  printTreeAsc() {
    this._immTree.printTreeAsc(this._root);
  }

  printTreeDesc() {
    this._immTree.printTreeDesc(this._root);
  }

  getColor() {
    return this._immTree.getColor(this._root);
  }

  getData() {
    return this._immTree.getData(this._root);
  }

  getMin() {
    return this._immTree.getMin(this._root);
  }

  getMax() {
    return this._immTree.getMax(this._root);
  }

  toArray() {
    return this._immTree.toArray(this._root);
  }

  traverseInOrder(fn, value) {
    return this._immTree.traverseInOrder(this._root, fn, value);
  }

  traversePreOrder(fn, value) {
    return this._immTree.traversePreOrder(this._root, fn, value);
  }

  traversePostOrder(fn, value) {
    return this._immTree.traversePostOrder(this._root, fn, value);
  }

  fold(fn, value) {
    return this._immTree.fold(this._root, fn, value);
  }

  foldLeft(fn, value) {
    return this.fold(fn, value);
  }

  foldRight(fn, value) {
    return this._immTree.foldRight(this._root, fn, value);
  }

  getLeft() {
    const left = this._immTree.getLeft(this._root);
    return left ? new ImmutableTree(this._comp, left) : undefined;
  }

  getRight() {
    const right = this._immTree.getRight(this._root);
    return right ? new ImmutableTree(this._comp, right) : undefined;
  }

  getHeight() {
    return this._immTree.getHeight(this._root);
  }

  getLength() {
    return this._immTree.getLength(this._root);
  }

  isEmpty() {
    return this._immTree.isEmpty(this._root);
  }
}

const fromArray = (compare, arr) =>
  new ImmutableTree(compare, immutableTree.Make({ compare }).fromArray(arr));

module.exports = {
  ImmutableTree,
  fromArray,
};
