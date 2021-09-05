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
    const items = [];
    for (const item of this._contents) {
      items.push(item);
      if (items.length > n) {
        items.shift();
      }
    }
    return items;
  }

  toArray() {
    return [...this._contents];
  }
};
