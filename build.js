const fs = require('fs-extra');
const sass = require('node-sass');

function renderSass(inPath, outPath, prod) {
  return new Promise((resolve, reject) => {
    sass.render({
      file: inPath,
      outFile: outPath,
      outputStyle: (prod) ? 'compressed' : 'nested',
      sourceMap: !prod
    }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
  }).then((res) => {
    return Promise.all([
      fs.writeFile(outPath, res.css),
      fs.writeFile(outPath + '.map', res.map)
    ]);
  });
}

if (require.main === module) {
  const prod = process.argv[2] === '--production';
  return Promise.all([
    fs.ensureDir('static/css')
      .then(() => renderSass('src/scss/plandocument.scss',
        'static/css/bundle.css', prod)
      .then(() => console.log('SCSS rendered.'))
      .catch((err) => console.error(err))),
    fs.copy(
      'node_modules/uswds/dist/js/uswds' + ((prod) ? '.min.js' : '.js'),
      'static/js/uswds.js')
      .then(() => 'JavaScript copied.'),
    fs.copy(
      'node_modules/uswds/dist/img',
      'static/img')
      .then(() => 'Images copied.')
  ]);
}
