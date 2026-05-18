const path = require('path');
try {
  const corePath = require.resolve('@vueuse/core/package.json');
  console.log('Core pkg:', corePath);
  console.log('Core dts:', path.resolve(path.dirname(corePath), 'dist/index.d.ts'));
} catch (e) {
  console.error(e.message);
}
