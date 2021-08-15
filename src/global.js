const ps = PropertiesService.getScriptProperties();

Array.prototype.eachSlice = function(n, callback) {
  for (let i = 0; i < this.length; i += n) {
    callback(this.slice(i, i+n));
  }
};

Array.prototype.last = function() {
  return this.slice(-1)[0];
};
