import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import util from './util.js';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import runSequence from 'run-sequence';
import inquirer from 'inquirer';
import replace from 'gulp-replace';
import fs from 'fs';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import _ from 'lodash';
import uglify from 'gulp-uglify'; // js压缩混淆
import minifyHtml from 'gulp-minify-html';		// html压缩
import minifyCss from 'gulp-minify-css'; // css压缩
import rev from 'swg-gulp-rev'; // 修改文件名增加md5，并生成rev-md5.json
import revCollector from 'swg-gulp-rev-collector';// 根据rev-md5.json对html中引用的静态资源路径做替换
import autoprefixer from 'gulp-autoprefixer';		// 自动添加css前缀
import sass from 'gulp-sass';			// sass预编译
import size from 'gulp-size';		// 显示gulp.dest输出到磁盘上的文件尺寸
import imagemin from 'gulp-imagemin';		// 图片压缩
import fileInclude from 'gulp-file-include';		// 为html引入tpl模板
import glob from 'glob';
import minimist from 'minimist';
import WebpackConfig from './webpack.config.js'; // 老版webpack配置
import WebpackSrcConfig from './webpack.src.config.js'; // 新版前后端分离webpack配置
import liveReload from 'gulp-livereload';		// 文件变化时自动刷新浏览器，chrome需要安装LiveReload插件
import mergeStream from 'merge-stream';		// 合并流然后返回给run-sequence保证任务顺序执行
import path from 'path';		// 路径解析模块
import spritesmith from 'gulp.spritesmith';		// 精灵图
import addSrc from 'gulp-add-src';
import eslint from 'gulp-eslint';

console.log(process.env.env);
console.log(process.env.num);
console.log(process.env.mini);


// 开发者配置文件
let DeveloperConfig = {};
if (fs.existsSync('./developer.config.js')) {
  DeveloperConfig = require('./developer.config.js').default;
}

// 命令行参数
let argv = minimist(process.argv);

// 结合开发者文件的参数
let BuildArg = {
  env_stage: process.env.env || DeveloperConfig.env_stage || 'prod',
  env_num: process.env.num || DeveloperConfig.env_num || '',
  page: process.env.page || DeveloperConfig.page || '*',
  webpack: process.env.webpack !== undefined ? argv.webpack : DeveloperConfig.webpack !== undefined ? DeveloperConfig.webpack : true
};

// 如果有值，说明是给服务端使用，强制编译所有页面。
if (process.env.env == 'prod') {
  BuildArg.page = '*';
  BuildArg.webpack = true;
}

// 只能接受字符串
process.env.mini = process.env.mini == 'true' ? 'true' : '';


// 项目路径配置
let config = {
  html: `src/page/${BuildArg.page}/*.html`,
  css: [`src/*page/${BuildArg.page}/css/*.scss`, 'src/*common/css/common.scss'],
  js: `src/page/${BuildArg.page}/js/*.js`,
  moveJs: 'src/*common/js/autoRootSize.js',
  img: [`src/*page/${BuildArg.page}/img/*`, 'src/*common/img/*'],
  iconDir: `src/page/${BuildArg.page}/img/icon*`,
  temp: '.temp'
};

// 替换表
let replacer = {
  '[[env_stage]]': '',
  '[[base_domain]]': '',
  '[[env_num]]': '',
  '[[static]]': '',
  '[[vendor]]': '//3n.dvmama.com'

  // '[[v]]': '',
};
let replacerRegExp = null;

// 询问编译参数
function promptBuildArg() {

  // 检查env_stage
  let domain = 'domain';
  if (BuildArg.env_stage == 'dev') {
    domain = 'fe.bravetime.net';
    replacer['[[base_domain]]'] = 'bravetime.net';
  } else if (BuildArg.env_stage == 'beta') {
    domain = 'fe.vyohui.cn';
    replacer['[[base_domain]]'] = 'vyohui.cn';
  } else if (BuildArg.env_stage == 'gray' || BuildArg.env_stage == 'tmp' || BuildArg.env_stage == 'prod') {
    domain = '5e.dvmama.com';
    replacer['[[base_domain]]'] = 'davdian.com';
  } else {

    // throw new Error(`env_stage参数不正确: ${BuildArg.env_stage}`);
    let errorValue = BuildArg.env_stage;
    BuildArg.env_stage = 'prod';
    console.log(`env_stage参数值不正确: ${errorValue}。已设置为默认值：${BuildArg.env_stage}`);
    domain = '5e.dvmama.com';
  }

  // 检查env_num
  if (BuildArg.env_num === '' || parseInt(BuildArg.env_num) >= 1 && parseInt(BuildArg.env_num) <= 20) {
  } else {

    // throw new Error(`env_num参数不正确: ${BuildArg.env_num}`);
    let errorValue = BuildArg.env_num;
    BuildArg.env_num = '';
    console.log(`env_num参数值不正确: ${errorValue}。已设置为默认值：'${BuildArg.env_num}'`);
  }

  // 设置替换表
  replacer['[[env_stage]]'] = BuildArg.env_stage;
  replacer['[[env_num]]'] = BuildArg.env_num;
  replacer['[[static]]'] = `//${domain}/wap/static${BuildArg.env_num || ''}/dist/static`;
  replacerRegExp = function() {
    let arr = [];
    for (let i in replacer) {
      let key = i.replace(/\[/g, '\\[');
      arr.push(key);
    }
    console.log(arr);
    return new RegExp(arr.join('|'), 'g');
  }();

  // 打印编译数据
  console.log(`argv: ${util.stringifyFormat(argv)}`);
  console.log(`BuildArg: ${util.stringifyFormat(BuildArg)}`);
  console.log(`replacer: ${util.stringifyFormat(replacer)}`);

}

/** ********************************** 创建新模块(npm run create) ************************************/
gulp.task('create', () => {
  console.log(`>>>>>>>>>>>>>>> 开始创建新页面。${util.getNow()}`);
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'please input page\'s name ?',
      validate: function(input) {
        return input ? true : false;
      }
    },
    {
      type: 'input',
      name: 'title',
      message: 'please input page\'s title ?'
    }
  ]).then((answer) => {
    console.log(JSON.stringify(answer, ' ', 2));
    let sourcePath = 'creator/**/*.*';
    let destPath = `src/page/${answer.name}`;
    gulp.src(sourcePath)
      .pipe(rename({basename: answer.name}))
      .pipe(replace('{{name}}', answer.name))
      .pipe(replace('${{title}}', answer.title || ''))
      .pipe(gulp.dest(destPath))
      .on('end', function() {
        setTimeout(function() {
          fs.mkdirSync(destPath + '/img');
          fs.mkdirSync(destPath + '/vue');
        }, 1000);
      })
    ;
    console.log(`>>>>>>>>>>>>>>> ${answer.name}页面已创建完毕。${util.getNow()}`);
  });
});

/** ********************************** 目录清理 ************************************/

// 开发环境目录清理
gulp.task('clean:dev', () => {
  console.log(`>>>>>>>>>>>>>>> 开发环境目录开始清理。${util.getNow()}`);
  return gulp.src('dev').pipe(clean());
});

// 生产环境目录清理
gulp.task('clean:dist', () => {
  console.log(`>>>>>>>>>>>>>>> 生产环境目录开始清理。${util.getNow()}`);
  return gulp.src('dist').pipe(clean());
});

// 编译过程临时目录清理
gulp.task('clean:temp', () => {
  console.log(`>>>>>>>>>>>>>>> 编译过程临时目录开始清理。${util.getNow()}`);
  return gulp.src(config.temp).pipe(clean());
});


/** ********************************** 合成精灵图 ************************************/

gulp.task('create_sprite', () => {
  console.log(`>>>>>>>>>>>>>>> 开始合成精灵图。${util.getNow()}`);
  let merged = mergeStream();

  // 遍历icon*名称的目录
  glob.sync(path.normalize(config.iconDir)).forEach(function(iconDir) {
    if (!fs.statSync(iconDir).isDirectory()) {
      return;
    }

    let dirArr = iconDir.split('/');

    // 生成文件的basename
    let dirName = dirArr.pop();

    // 路径中的src替换成[[static]]
    dirArr[0] = '[[static]]';

    let stream = gulp.src(iconDir + '/*')
      .pipe(spritesmith({
        cssTemplate: './spritesmith.hbs',
        padding: 10,
        layout: 'top-down',
        imgName: `${dirName}.png`,
        cssName: `../css/_${dirName}.scss`,

        // 取相对路径即可,因为css和img是部署在一起的
        // imgPath: `../img/${dirName}.png`,
        // 取绝对路径即可,因为要做md5版本号
        imgPath: `${dirArr.join('/')}/${dirName}.png`,
        cssVarMap: function(sprite) {
          sprite.mixinName = `i-${sprite.name}`;
        }
      }));

    merged.add(stream.img.pipe(gulp.dest(iconDir + '/..')));
    merged.add(stream.css.pipe(gulp.dest(iconDir + '/..')));
  });
  return merged.isEmpty() ? null : merged; // 保证顺序执行
});


/** ********************************** 编译JS ************************************/

// JS公共编译方法
function getWebpackConfig() {
  console.log(`>>>>>>>>>>>>>>> js文件开始编译。${util.getNow()}`);

  // webpack配置对象
  let webpackConfig = WebpackSrcConfig(config.js, replacer['[[static]]']);

  // 提取公共js
  if (process.env.env) {
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'common/js/common.js',
      minChunks: 10
    }));
  }

  return webpackConfig;
}

// 开发环境JS编译
gulp.task('js:start', () => {
  return gulp.src(config.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(webpackStream(getWebpackConfig(), webpack, function(err, stats) {

      // console.log('webpackStream执行完毕');
    }))

    // 替换环境变量
    .pipe(replace(replacerRegExp, function(match) {
      return replacer[match];
    }))

    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出
    .pipe(gulp.dest('dist/static'));
});

// 开发环境JS编译
gulp.task('js:dev', () => {
  return gulp.src(config.js)
    .pipe(webpackStream(getWebpackConfig(), webpack, function(err, stats) {

      // console.log('webpackStream执行完毕');
    }))

    // 替换环境变量
    .pipe(replace(replacerRegExp, function(match) {
      return replacer[match];
    }))

    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出
    .pipe(gulp.dest('dist/static'));
});

// 生产环境JS编译
gulp.task('js:dist', () => {
  return gulp.src(config.js)
    .pipe(webpackStream(getWebpackConfig(), webpack, function(err, stats) {

      // console.log('webpackStream执行完毕');
    }))

    // 替换环境变量
    .pipe(replace(replacerRegExp, function(match) {
      return replacer[match];
    }))
    .pipe(uglify())

    // 收集JS文件的MD5
    .pipe(rev())

    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出JS
    .pipe(gulp.dest('dist/static'))

    // 记录MD5
    .pipe(rev.manifest('rev-md5/js.json'))

    // 输出MD5
    .pipe(gulp.dest(config.temp));
});


/** ********************************** 只移动、不编译的JS ************************************/

// JS公共编译方法
function moveJs() {
  console.log(`>>>>>>>>>>>>>>> move-js文件开始编译。${util.getNow()}`);

  // 编译并返回流
  return gulp.src(config.moveJs);
}

// 开发环境JS编译
gulp.task('move-js:dev', () => {
  return moveJs()

  // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出
    .pipe(gulp.dest('dist/static'));
});

// 生产环境JS编译
gulp.task('move-js:dist', () => {
  return moveJs()
    .pipe(uglify())

    // 收集JS文件的MD5
    .pipe(rev())

    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出JS
    .pipe(gulp.dest('dist/static'))

    // 记录MD5
    .pipe(rev.manifest('rev-md5/js-move.json'))

    // 输出MD5
    .pipe(gulp.dest(config.temp));
});


/** ********************************** 编译CSS ************************************/

// CSS公共编译方法
function compileCss() {
  console.log(`>>>>>>>>>>>>>>> CSS文件开始编译。${util.getNow()}`);

  return gulp.src(config.css)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'uncompressed'}))

    // 替换环境变量
    .pipe(replace(replacerRegExp, function(match) {
      return replacer[match];
    }))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(autoprefixer());
}

// 开发环境CSS编译
gulp.task('css:dev', () => {
  return compileCss()

  // 替换版本号
    .pipe(replace('[[v]]', `?v=${util.getTimeFormatVersion()}`))
    .pipe(sourcemaps.write('./'))

    // 显示文件体积
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('dist/static'));
});

// 生产环境CSS编译
gulp.task('css:dist', () => {
  return compileCss()

  // 替换版本号
    .pipe(replace('[[v]]', ''))
    .pipe(addSrc('.temp/rev-md5/img.json'))

    // 增加MD5戳
    .pipe(revCollector())
    .pipe(minifyCss())
    .pipe(rev())

    // 显示文件体积
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('dist/static'))
    .pipe(rev.manifest('rev-md5/css.json'))
    .pipe(gulp.dest(config.temp))
  ;
});


/** ********************************** 编译图片 ************************************/

// 图片公共编译方法
function compileImg() {
  console.log(`>>>>>>>>>>>>>>> 图片文件开始编译。${util.getNow()}`);

  return gulp.src(config.img);
}

// 开发环境图片编译
gulp.task('img:dev', () => {
  return compileImg()

  // 显示文件体积
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('dist/static'));
});

// 生产环境图片编译
gulp.task('img:dist', () => {
  return compileImg()

  // .pipe(imagemin())
    .pipe(rev())

    // 显示文件体积
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('dist/static'))

    // 记录MD5
    .pipe(rev.manifest('rev-md5/img.json'))
    .pipe(gulp.dest(config.temp));
});


/** ********************************** 收集旧静态资源的md5信息 ************************************/

gulp.task('old:rev', () => {
  console.log(`>>>>>>>>>>>>>>> 图片文件开始编译。${util.getNow()}`);
  return gulp.src([
    'stylesheet/base.css',
    'stylesheet/model.css',
    'javascript/units.js',
    'javascript/base.js',
    'javascript/model.js'
  ])
    .pipe(rev())
    .pipe(rev.manifest('rev-md5/old:rev.json'))
    .pipe(gulp.dest(config.temp))
  ;
});


/** ********************************** 编译HTML ************************************/

// HTML编译公共方法
function compileHtml(production) {
  console.log(`>>>>>>>>>>>>>>> html文件开始编译。${util.getNow()}`);

  // 源文件路径
  let src = [config.html];

  // 生产环境源文件路径增加MD5记录文件
  if (production) {
    src.push('.temp/rev-md5/*.json');
  }

  // 编译并返回流
  return gulp.src(src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: __dirname + '/src/common/include/'
    }))

    // 替换环境变量
    .pipe(replace(replacerRegExp, function(match) {
      return replacer[match];
    }))
    .pipe(rename({dirname: ''}));
}

// 本地开发环境HTML编译
gulp.task('html:start', function() {
  return compileHtml()

  // 替换版本号
    .pipe(replace('[[v]]', `?v=${util.getTimeFormatVersion()}`))

    // .pipe(replace('/vue.min.js', `/vue.js`))
    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出
    .pipe(gulp.dest('dist/view'))
  ;
});

// 开发环境HTML编译
gulp.task('html:dev', function() {
  return compileHtml()

  // 替换版本号
    .pipe(replace('[[v]]', `?v=${util.getTimeFormatVersion()}`))

    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出
    .pipe(gulp.dest('dist/view'))
  ;
});

// 生产环境HTML编译
gulp.task('html:dist', function() {
  return compileHtml(true)

  // 替换版本号
    .pipe(replace('[[v]]', ''))

    // 增加MD5戳
    .pipe(revCollector())

    // 压缩HTML
    .pipe(minifyHtml())

    // 显示文件体积
    .pipe(size({showFiles: true}))

    // 输出
    .pipe(gulp.dest('dist/view'))
  ;
});


/** ********************************** 编译webpack.config.js ************************************/

// 开发环境webpack编译(带文件监听)
gulp.task('webpack:default', () => {
  console.log(`>>>>>>>>>>>>>>> 开始编译webpack.config.js。。。${util.getNow()}`);
  WebpackConfig.output.path = undefined;
  WebpackConfig.watch = true;
  return gulp.src('')
    .pipe(webpackStream(WebpackConfig, webpack, function(err, stats) {

      // console.log('webpackStream执行完毕');
    }))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('dist'));
});

// 如果是全编译命令，自动检查webpack.config.js entry数量，防止误注释，目前是65个入口（2018-04-02）
function checkEntry() {
  if (process.env.env) {
    let count = 0;
    for (let i in WebpackConfig.entry) {
      count ++;
    }
    if (count < 46) {
      throw new Error(`entry数量应该>=46，检测到实际数量为${count}。请检查webpack.config.js entry是否有注释或者删除(有疑问请联系sunweiguang@davdian.com)。`);
    }
  }
}

// 开发环境webpack编译(不带文件监听)
gulp.task('webpack:dev', () => {
  if (BuildArg.webpack) {
    console.log(`>>>>>>>>>>>>>>> 开始编译webpack.config.js。。。${util.getNow()}`);
    WebpackConfig.output.path = undefined;
    checkEntry();

    // WebpackConfig.watch = true;
    return gulp.src('')
      .pipe(webpackStream(WebpackConfig, webpack, function(err, stats) {

        // console.log('webpackStream执行完毕');
      }))
      .pipe(size({showFiles: true}))
      .pipe(gulp.dest('dist'));
  }
});

// 生产环境webpack编译
gulp.task('webpack:dist', () => {
  if (BuildArg.webpack) {
    console.log(`>>>>>>>>>>>>>>> 开始编译webpack.config.js。。。${util.getNow()}`);
    WebpackConfig.output.path = undefined;
    WebpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
    checkEntry();
    return gulp.src('')
      .pipe(webpackStream(WebpackConfig, webpack, function(err, stats) {

        // console.log('webpackStream执行完毕');
      }))
      .pipe(replace('display:flex;', 'display:-webkit-flex;display:flex;'))
      .pipe(replace(';flex:1;', ';-webkit-flex:1;flex:1;'))
      .pipe(size({showFiles: true}))
      .pipe(gulp.dest('dist'));
  }
});

/** ********************************** 开始构建 ************************************/
gulp.task('default', () => {
  promptBuildArg();

  /** ********************************** 发布版 ************************************/
  if (process.env.env) {

    /** ********************************** 发布压缩版 ************************************/
    if (process.env.mini) {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~发布压缩版~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      return runSequence(

        // ['clean:dist'],
        // ['sprite'],
        ['js:dist'],
        ['move-js:dist'],
        ['img:dist'],
        ['css:dist'],
        ['old:rev'],
        ['html:dist'],
        ['clean:temp'],
        ['webpack:dist'],
        function() {
          console.log(`>>>>>>>>>>>>>>> gulp编译生产环境全部任务执行完毕。${util.getNow()}`);
        }
      );

      /** ********************************** 非压缩版 ************************************/
    } else {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~发布非压缩版~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      return runSequence(

        // ['clean:dist'],
        // ['sprite'],
        ['js:dev'],
        ['move-js:dev'],
        ['img:dev'],
        ['css:dev'],
        ['html:dev'],
        ['webpack:dev'],
        function() {
          console.log(`>>>>>>>>>>>>>>> gulp编译开发环境全部任务执行完毕。${util.getNow()}`);
        }
      );
    }

    /** ********************************** 本地调试版 ************************************/
  } else {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~本地调试版~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    return runSequence(

      // ['clean:dist'],
      // ['create_sprite'],
      ['js:start'],
      ['move-js:dev'],
      ['img:dev'],
      ['css:dev'],
      ['html:start'],

      // ['webpack:default'],
      function() {
        gulp.watch(['src/**/img/icon*/*'], ['create_sprite']);

        // 监视js变化
        gulp.watch(['src/**/*.{js,vue,json,es6}', 'node_modules/dvd-*/**/*.{js,vue,json,es6}'], ['js:start', 'move-js:dev', 'html:start']);

        // 监视旧的js变化
        gulp.watch(['{javascript,module,source,utils}/**/*.{js,vue,json,es6}'], ['js:start', 'html:start']);

        // 监视css变化
        gulp.watch(['src/**/*.scss', 'node_modules/dvd-*/**/*.scss'], ['css:dev', 'html:start']);

        // 监视图片变化
        gulp.watch(['src/**/img/*.{png,jpg,gif,jpeg}', 'node_modules/dvd-*/**/img/*.{png,jpg,gif,jpeg}'], ['img:dev', 'js:start', 'html:start']);

        // 监视html变化
        gulp.watch(['src/**/*.{html,include}'], ['html:start']);

        // 开启liveReload
        liveReload.listen();

        // 监听开发目录变化，触发liveReload刷新浏览器
        gulp.watch(['dist/**/*'], function(file) {
          liveReload.changed(file.path);
        });
        console.log(`>>>>>>>>>>>>>>> gulp开始监听src目录文件变化...${util.getNow()}`);
        if (BuildArg.webpack) {
          runSequence(['webpack:default']);
        }
      }
    );
  }


});

/** ********************************** old ************************************/
const es6Path = {
  src: 'es6/*.es6',
  dest: 'javascript'
};
gulp.task('babel', function() {
  return gulp.src(es6Path.src)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(es6Path.dest));
});
gulp.task('watch', function() {
  gulp.watch(es6Path.src, ['babel']);
});
gulp.task('default_es6', ['watch', 'babel']);
