var _isNaN = function(value) {
  return typeof value === 'number' && isNaN(value);
};
var _isObject = function(value) {
  return typeof value === 'object' && value !== null;
};
var _isArray = Array.isArray || function(value) {
  return '' + value !== value && {}.toString.call(value) == "[object Array]";
};
var _copy = function(obj) {
  var copy = {};
  for (var key in obj) {
    copy[key] = obj[key];
  }
  return copy;
};

var build = function build(value, path) {
  var constructed = value;
  var parts = path.split(".");
  for (var i = parts.length - 1; i >= 0; --i) {
    var key = parts[i];
    var index = parseInt(key, 10);
    if (index != null && !_isNaN(index)) {
      var item = [];
      item[index] = constructed;
      constructed = item;
    } else {
      var item = {};
      item[key] = constructed;
      constructed = item;
    }
  }
  return constructed;
};

var unset = function unset(path, obj) {
  var parts = path.split(".");
  var value = obj;
  _.each(parts, function(key, index, all) {
    if (obj == null) return;
    var index = parseInt(key, 10);
    if (index != null && !_isNaN(index)) {
      value = value[index];
    } else {
      value = value[key];
    }
    
  });
  return obj;
};

var set = function set(value, path, obj) {
  var partial = build(value, path);
  var base = obj;
  var source = partial;
  var parts = path.split(".");
  for (var i = 0; i < parts.length; ++i) {
    var part = parts[i];
    var first;
    var second;
    var index = parseInt(part, 10);
    if (index != null && !_isNaN(index)) {
      first = base[index];
      second = source[index];
      if (!first) first = second.slice(0);
    } else {
      index = part;
      first = base[part];
      second = source[part];
      if (!first) first = _copy(first);
    }
    if ((i == parts.length - 1) || ((!_isObject(first) && !_isArray(first)) || (!_isObject(second) && !_isArray(second)))) {
      base[index] = source[index]
      break;
    } else {
      base = first;
      source = second;
    }
  }
  return obj;
};

var get = function get(path, obj) {
  var parts = path.split(".");
  var value = obj;
  _.each(parts, function(key) {
    if (value == null) return;
    var index = parseInt(key, 10);
    if (index != null && !_.isNaN(index)) {
      value = value[index];
    } else {
      value = value[key];
    }
  });
  return value;
};

var transfer = function transfer(path, src, dest) {
  var val = get(path, src);
  if (val) set(val, path, dest);
  return val;
};

exports.get = get;
exports.set = set;
exports.transfer = transfer;
