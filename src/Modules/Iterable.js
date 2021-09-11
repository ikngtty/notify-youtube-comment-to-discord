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

  take(n) {
    const gen = function* () {
      const iterator = this._contents[Symbol.iterator]();
      for (let i = 0; i < n; i++) {
        const iterated = iterator.next();
        if (iterated.done) {
          break;
        }
        yield iterated.value;
      }
    }.bind(this);
    return new Modules.Iterable(gen());
  }

  // lastN(n) {
  //   const items = [];
  //   for (const item of this._contents) {
  //     items.push(item);
  //     if (items.length > n) {
  //       items.shift();
  //     }
  //   }
  //   return items;
  // }

  toArray() {
    return [...this._contents];
  }
};
