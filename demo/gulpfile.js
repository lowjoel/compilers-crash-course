const gulp = require('gulp');
const jison = require('gulp-jison');

function jisonGlob(path) {
  return gulp.src(path + '/*.jison')
        .pipe(jison({ moduleType: 'commonjs' }))
        .pipe(gulp.dest(path));
}

gulp.task('default', ['calculator']);

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