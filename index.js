const http = require('http'),
  request = require('request'),
  AdmZip = require('adm-zip'),
  path = require('path'),
  copydir = require('copy-dir'),
  fs = require('fs'),
  temp = require('temp').track(),
  createHandler = require('github-webhook-handler'),
  secret = fs.readFileSync('/run/secrets/github_deployment_webhook', 'utf8').trim(),
  handler = createHandler({
    path: '/hooks',
    secret: secret
  });

http.createServer((req, res) => {
  handler(req, res, (err) => {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(7777);

handler.on('err', function(err) {
  console.error('Error :', err);
});

handler.on('push', downloadAndUnzip);

function downloadAndUnzip() {
  console.log('Event received');
  var stream = temp.createWriteStream();

  request('https://github.com/chooban/ace-data-container/archive/master.zip')
    .pipe(stream)
    .on('close', unzipAndCopy);

  function unzipAndCopy() {
    const zip = new AdmZip(stream.path);
    temp.mkdir('contents', (err, dirPath) => {
      if (err) {
        console.error('Error unzipping download:', err);
        return;
      }

      zip.extractAllTo(dirPath, true);
      copydir.sync(dirPath + '/ace-data-container-master/data/', '/data/', (stat, filepath, filename) => {
        return (stat ==='file' && path.extname(filepath) === '.csv');
      });
      temp.cleanup();
    });
  }
}
