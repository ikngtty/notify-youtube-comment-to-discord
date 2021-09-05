try {
  Modules;
} catch {
  Modules = {};
}
Modules.SizedList = class {
  constructor(max) {
    this._max = max;
    this._list = new Modules.List();
  }

  push(item) {
    this._list.push(item);
    if (this._list.length > this._max) {
      this._list.shift();
    }
  }

  toArray() {
    return this._list.toArray();
  }
}
