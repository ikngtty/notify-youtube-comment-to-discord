try {
  Modules;
} catch {
  Modules = {};
}
Modules.SizedArray = class {
  constructor(max) {
    this._max = max;
    this._array = [];
  }

  push(item) {
    this._array.push(item);
    if (this._array.length > this._max) {
      this._array.shift();
    }
  }

  toArray() {
    return this._array;
  }
}
