# performance

A simple Javascript Performance Tester.

![](https://img.alicdn.com/tps/TB1d238JpXXXXcoXFXXXXXXXXXX-446-570.gif)

Live Demo: <https://barretlee.github.io/performance/>


## Run Demo

```bash
git clone https://github.com/barretlee/performance.git
cd performance/test;
open index.html;
```

And you can also download the code from npm.

```bash
npm install performance-tester;
```

## Usage

```javascript
new Performance({
  query: '.item textarea',
  timeout: 1000,
  info: 'Click the code button, run tester.'
});
```

- `query`, the code will be run.
- `timeout`, how long does code run.
- `info`, tester descriptor before table.

## LICENSE & Thank

MIT.

Thank for https://share.web-tinker.com/performance.js.