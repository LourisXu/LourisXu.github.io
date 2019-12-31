var gulp = require('gulp');
var minifycss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
var pngquant =require('imagemin-pngquant-gfw');
var cache =require('gulp-cache');
// 压缩html
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
          removeComments: true,//清除HTML注释
          //collapseWhitespace: true,//消去HTML的空格
          collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
          removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
          removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
          removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
          minifyJS: true,//压缩页面JS
          minifyCSS: true,//压缩页面CSS
          minifyURLs: true
        }).on('error',function(e){
          console.log(e);//这里console控制台对于定位错误位置很有用
        }))
        .pipe(gulp.dest('./public'))
});
//监测代码修改自动执行任务
//gulp.task('minify-html-auto',function(){
//    return gulp.watch('./public/**/*.html',['minify-html']);
//})

// 压缩css
gulp.task('minify-css', function() {
    //return gulp.src('./public/**/*.css')
    return gulp.src(['./public/**/*.css','!./public/**/*.min.css'])
        .pipe(minifycss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./public'));
});
//监测代码修改自动执行任务
//gulp.task('minify-css-auto',function(){
//    return gulp.watch('./public/**/*.css',['minify-css']);
//})

// 压缩js
gulp.task('minify-js', function() {
    //return gulp.src('./public/js/**/*.js')
    //只需压缩该目录下的js即可，其他目录的js已经是min.js格式无需压缩，如果是ES6标准的js也不能压缩
    return gulp.src(['./public/**/*.js','!./public/**/*.min.js'])
        .pipe(uglify().on('error',function(e){
          console.log(e);//这里console控制台对于定位错误位置很有用
        }))
        .pipe(gulp.dest('./public'));
});
//监测代码修改自动执行任务
//gulp.task('minify-js-auto',function(){
//    return gulp.watch('./public/js/**/*.js',['minify-js']);
//})

// 压缩图片
gulp.task('minify-images', function () {
    return gulp.src('./public/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({ //只压缩修改的图片的cache插件
            progressive: true, //无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}],//不要移出svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest('./public'));
});
//监测代码修改自动执行任务
//gulp.task('minify-images-auto',function(){
//    return gulp.watch('./public/**/*.{png,jpg,gif,ico}',['minify-images']);
//})

// 默认任务，Gulp3
/*gulp.task('default', [
    'minify-html','minify-css','minify-js','minify-images'
    //,'minify-html-auto','minify-css-auto','minify-js-auto','minify-images-auto'
]);*/

//默认任务，Gulp4
gulp.task('default',
    gulp.parallel('minify-html','minify-css','minify-js','minify-images'
    //,'minify-html-auto','minify-css-auto','minify-js-auto','minify-images-auto'
));
