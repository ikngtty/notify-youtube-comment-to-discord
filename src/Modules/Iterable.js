try {
  Modules;
} catch {
  Modules = {};
}
Modules.Iterable = class {
  constructor(iterable) {
    this._contents = iterable;
  }

  *[Symbol.iterator]() {
    for (const item of this._contents) {
      yield item;
    }
  }

  filter(callback) {
    const gen = function* () {
      for (const item of this._contents) {
        if (callback(item)) {
          yield item;
        }
      }
    }.bind(this);
    return new Modules.Iterable(gen());
  }

  lastN(n) {
    // HACK: This implementation, which stores all iterated items in an array,
    // may use a lot of memory space.
    return this.toArray().slice(-1 * n);
  }

  toArray() {
    return [...this._contents];
  }
};
