var objectAssign = require('object-assign');
var objectNest = require('object-nest');

module.exports = function groupBy (array, options) {
  options = options || {};
  options.removeKey = typeof options.removeKey === 'boolean' ? options.removeKey : true;
  options.key = options.key || 'index';
  var maxLevel = 1;
  var formated = array.map(function (item) {
    var value = item.index.split('.');
    if (value.length > maxLevel) {
      maxLevel = value.length;
    }
    return objectAssign(item, { [options.key]: item[options.key].split('.') });
  });
  var levels = [];
  for (var i = 0; i < maxLevel; i++) {
    var level = formated.filter(function (item) {
      return item[options.key].length === i + 1;
    });
    levels.push(level);
  }
  var result = {};
  for (var i = 0; i < levels.length; i++) {
    var level = levels[i];
    for (var n = 0; n < level.length; n++) {
      var item = level[n];
      var key = item[options.key].join('.');
      if (options.removeKey) {
        delete item[options.key];
      }
      result = objectNest(result, key, item);
    }
  }
  return result;
};