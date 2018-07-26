var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

gulp.task('hello', function() {
  console.log('Hello Zell');
});

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass()) // Конвертируем Sass в CSS с помощью gulp-sass
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream:true
  }))
});

gulp.task('useref', function(){
  var assets = useref.assets();
  return gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.css', minifyCSS()))
  .pipe(gulpIf('*.js',uglify()))
  .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', function() {
  return del.sync('dist').then(function(cd){
    return cache.clearAll(cd);
  });
});

gulp.task('clean:dist', function(){
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
    baseDir: 'app'
    },
  })
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch', callback)
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
  ['sass', 'useref', 'images', 'fonts'],
  callback
  )
});
