const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

gulp.task('alljsUtil', () => gulp.src([
        './js/*',
        './js/**/*',
        './js/**/**/*',
    ])
    .pipe(gulp.dest('./wp/js/')));

gulp.task('all', () => gulp.src([
        './pages/**/*.html',
        './pages/**/img/*',
        './pages/**/img/icon/*',
        './pages/**/lib/*',
        './pages/**/fonts/*',
        './pages/**/js/*.min.js'
    ])
    .pipe(gulp.dest('./wp/pages/')));

// 压缩js
gulp.task('utils_uglify_js', () => gulp.src([
        './pages/**/*.js',
        '!./pages/**/*.min.js'
    ])
    .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true//类型：Boolean 默认：true 是否完全压缩
        }))
    // 压缩时进行异常捕获
    .on('error', (err) => {
        console.log('line number: %d, message: %s', err.lineNumber, err.message);
        this.end();
    })
    .pipe(gulp.dest('./wp/pages/')));

// 压缩widgets css
gulp.task('utils_uglify_css', () => gulp.src([
        './pages/**/*.css',
        '!./pages/**/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(gulp.dest('./wp/pages/')));


gulp.task('Cfg_Jquery_Mui_Must_concat', () => gulp.src([
        './js/config.js',
        './js/libs/jquery.min.js',
        './js/libs/mui.min.js',
        './js/libs/mustache.min.js'
    ])
    .pipe(concat('Cfg_Jquery_Mui_Must.js'))
    .pipe(gulp.dest('./concat')));

gulp.task('default', ['alljsUtil' , 'all' , 'utils_uglify_js' , 'utils_uglify_css' , 'Cfg_Jquery_Mui_Must_concat']);

gulp.task('watch', () => {
    gulp.watch([
        'js/**/*.js',
        'pages/**/*.js',
        // 避免压缩文件影响
        '!**/*.min.js',
    ], ['default']);
});