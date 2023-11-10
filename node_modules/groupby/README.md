# Groupby [![Build Status](https://img.shields.io/circleci/project/egoist/groupby/master.svg)](https://circleci.com/gh/egoist/groupby/tree/master)

Group a set of objects by some specific semantic property.

## Installation

```bash
npm install --save groupby
```

## Example

```javascript
const groupBy = require('groupby');
var data = [
  {
    index: '1',
    name: 'foo'
  },
  {
    index: '1.1',
    name: 'bar'
  },
  {
    index: '2.2',
    name: 'hoo'
  },
  {
    index: '3.1',
    name: 'hia'
  }
];
// by default it's grouped by `index`
data = groupBy(data);
// output
{
  "1": {
    "1": {
      "name": "bar"
    },
    "name": "foo"
  },
  "2": {
    "2": {
      "name": "hoo"
    }
  },
  "3": {
    "1": {
      "name": "hia"
    }
  }
}
```

## Why

It's useful for managing something with multi-level structure, for example a book, it has chapter 1, chapter 1.1 or even chapter 1.2.1. You can put all files in the same folder and use `groupby` to structure them when you need the whole book index, like you want to build an API for the book.

## License

MIT &copy; [EGOIST](https://github.com/egoist)