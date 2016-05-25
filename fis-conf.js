// fis.match('*', {
//   useHash: false
// });
//
//
// fis.match('::packager', {
//   postpackager: fis.plugin('loader', {
//     allInOne: true
//   })
// });
//
// // fis-parser-less 插件进行解析
// fis.match('*.less', {
//   parser: fis.plugin('less'),
//   rExt: '.css'
// });

// fis.match('*.{css,less}', {
//   packTo: '/static/aio.css'
// });

// fis.match('*.js', {
//   packTo: '/static/aio.js'
// });

/**
 * 将 fis 的构建根目录切换到 ./src 目录下，以便更好的管理源代码
 */
fis.project.setProjectRoot('src');
fis.processCWD = fis.project.getProjectPath();

// npm install [-g] fis3-hook-commonjs
fis.hook('commonjs');

fis.match('/components/**/*.js', {
    isMod: true, // 设置 comp 下都是一些组件，组件建议都是匿名方式 define
    release: '/static/$0'
});

//page里的页面发布到根目录
fis.match("/pages/(*)/*(.html)", {
    release: '/$1$2',
    useCache: false
});

fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

// fis3 release prod 产品发布，进行合并
fis.media('prod')
    .match('*.js', {
        packTo: '/static/aio.js'
    });
