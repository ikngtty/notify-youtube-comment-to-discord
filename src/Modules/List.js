try {
  Modules;
} catch {
  Modules = {};
}
Modules.List = class {
  constructor() {
    this._first = null;
    this._last = null;
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  *[Symbol.iterator]() {
    let item = this._first;
    while (item) {
      yield item.value;
      item = item.next;
    }
  }

  push(item) {
    const newLast = {
      value: item,
      next: null,
    };
    if (this._last) {
      this._last.next = newLast;
    } else {
      this._first = newLast;
    }
    this._last = newLast;
    this._length++;
  }

  shift() {
    if (!this._first) {
      return;
    }
    const value = this._first.value;
    this._first = this._first.next;
    if (!this._first) {
      this._last = null;
    }
    this._length--;
    return value;
  }

  toArray() {
    return [...this[Symbol.iterator]()]
  }
}
