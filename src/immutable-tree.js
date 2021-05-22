const immutableTree = require('./ImmutableTree.bs.js');

class ImmutableTree {
  #immTree;
  #root;
  #comp

  constructor(comp, node) {
    this.#comp = comp;
    this.#immTree = immutableTree.Make({ compare: comp });
    this.#root = node || this.#immTree.empty();
  }

  insert(t) {
    return new ImmutableTree(this.#comp, this.#immTree.insert(this.#root, t));
  }

  search(t) {
    return this.#immTree.search(this.#root, t);
  }

  deleteNode(t) {
    return new ImmutableTree(this.#comp, this.#immTree.deleteNode(this.#root, t));
  }

  update(old, next) {
    return new ImmutableTree(this.#comp, this.#immTree.update(this.#root, old, next));
  }

  printTreeAsc() {
    this.#immTree.printTreeAsc(this.#root);
  }

  printTreeDesc() {
    this.#immTree.printTreeDesc(this.#root);
  }

  getColor() {
    return this.#immTree.getColor(this.#root);
  }

  getData() {
    return this.#immTree.getData(this.#root);
  }

  getMin() {
    return this.#immTree.getMin(this.#root);
  }

  getMax() {
    return this.#immTree.getMax(this.#root);
  }

  toArray() {
    return this.#immTree.toArray(this.#root);
  }

  fold(fn, value) {
    return this.#immTree.fold(this.#root, fn, value);
  }

  foldLeft(fn, value) {
    return this.fold(fn, value);
  }

  foldRight(fn, value) {
    return this.#immTree.foldRight(this.#root, fn, value);
  }
}

const fromArray = (compare, arr) =>
  new ImmutableTree(compare, immutableTree.Make({ compare }).fromArray(arr));

module.exports = {
  ImmutableTree,
  fromArray
};
