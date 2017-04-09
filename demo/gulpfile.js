const gulp = require('gulp');
const jison = require('gulp-jison');

function jisonGlob(path) {
  return gulp.src(path + '/*.jison')
        .pipe(jison({ moduleType: 'commonjs' }))
        .pipe(gulp.dest(path));
}

gulp.task('default', ['calculator', 'simple', 'arrow']);
gulp.task('test', ['simpleTest', 'arrowTest']);

gulp.task('calculator', ['calculatorParser', 'calculatorRun']);
gulp.task('calculatorParser', function() {
  return jisonGlob('./calculator');
});
gulp.task('calculatorRun',  function() {
  const calculator = require('./calculator/run');
  calculator();
});

gulp.task('simple', function() {
  const simple = require('./simple/run');
  simple();
});
gulp.task('simpleTest', function() {
  const mocha = require('gulp-mocha');
  return gulp.src('simple/test/**/*_spec.js', {read: false})
         .pipe(mocha());
});

gulp.task('arrow', function() {
  const arrow = require('./arrow/run');
  arrow();
});
gulp.task('arrowTest', function() {
  const mocha = require('gulp-mocha');
  return gulp.src('arrow/test/**/*_spec.js', {read: false})
         .pipe(mocha());
});
