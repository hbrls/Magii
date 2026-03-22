const path = require('path');
const gulp = require('gulp');


gulp.task('.copy-dist', () => {
  return gulp
    .src([
      path.resolve('.dist/roadmap/rsrc/**/*'),
    ])
    .pipe(gulp.dest(path.resolve('../roadmap/public/rsrc')));
});

gulp.task('.copy-view', () => {
  return gulp
    .src([
      path.resolve('.dist/roadmap/*.html'),
    ])
    .pipe(gulp.dest(path.resolve('../roadmap/view')));
});

gulp.task('.copy', gulp.series('.copy-dist', '.copy-view'), () => {});


gulp.task('build', gulp.series('.copy'), () => {});
