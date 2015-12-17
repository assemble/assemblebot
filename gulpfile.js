'use strict';

var gulp = require('gulp');
var through = require('through2');
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

var expand = require('expand-args');
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2), {
  d: 'data',
  s: 'secret'
});

gulp.task('build', function (cb) {
  var child = spawn('npm', ['run', 'build'],  {stdio: 'inherit', cwd: path.join(__dirname)});
  child.on('error', cb);
  child.on('close', function () {
    gulp.src(path.join(__dirname, 'dist/main.js'))
      .pipe(through.obj(function (file, enc, next) {
        file.contents = new Buffer('exports = module.exports;\n' + file.contents.toString());
        next(null, file);
      }))
      .pipe(gulp.dest(path.join(__dirname, 'dist')))
      .on('error', cb)
      .on('finish', cb);
  });
});

gulp.task('deploy', function (cb) {
  var args = ['create', 'dist/main.js', '--name', 'assemblebot'];
  var secrets = argv.secret;
  if (secrets && secrets.length) {
    secrets = Array.isArray(secrets) ? secrets : [secrets];
    secrets.forEach(function (secret) {
      args.push('--secret', secret);
    });
  }
  var child = spawn('wt', args,  {stdio: 'inherit', cwd: path.join(__dirname)});
  child.on('error', cb);
  child.on('close', function () {
    cb();
  });
});

gulp.task('run', function (cb) {
  var data = {};
  if (argv.data) {
    try { data = expand(argv).data || {} }
    catch (err) {
      console.log(err);
      var segs = argv.data.split(':');
      data[segs[0]] = segs[1];
    }
  }

  var url = 'https://webtask.it.auth0.com/api/run/wt-brian_woodward-gmail_com-0/assemblebot?webtask_no_cache=1';
  for (var key in data) {
    url += '&' + key + '=' + data[key];
  }

  var args = [url];
  var child = spawn('curl', args,  {stdio: 'inherit', cwd: path.join(__dirname)});
  child.on('error', cb);
  child.on('close', function () {
    console.log();
    cb();
  });
});

gulp.task('default', function (cb) {
  console.log('Usage:');
  console.log(' gulp build');
  console.log(' gulp deploy --secret=XXX');
  console.log(' gulp run --data=[payload] ');
  console.log();
  cb();
});

module.exports = gulp;
