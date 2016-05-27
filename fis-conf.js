/**
 * 一些默认的配置，约定俗成的规则
 */

// 不需要加hash的文件
var noHash = [
    'noHash/**' // 放在noHash文件夹下的所有文件
];

// 不需要define包裹的文件
var noMod = [
    '_*.js'
];

/**
 * 将 fis 的构建根目录切换到 ./src 目录下，以便更好的管理源代码
 */
fis.project.setProjectRoot('src');
fis.processCWD = fis.project.getProjectPath();

/**
 * 使用 CommonJS 规范，配合 mod.js 一起使用
 * npm install [-g] fis3-hook-commonjs
 *
 * https://github.com/fex-team/fis3-hook-commonjs
 * https://github.com/fex-team/mod
 */
fis.hook('commonjs');

/**
 * 对 js 进行组件化处理
 */
fis.match('/{pages,modules,components}/**.js', {
    isMod: true
});

/**
 * 处理 noMod
 */
noMod.forEach(function (item) {
    fis.match(item, {isMod: false});
});

/**
 * 处理scss和css
 */
fis.match('*.scss', {
    rExt: '.css',
    parser: fis.plugin('node-sass')
})
    .match('_*.scss', {
        release: false
    })
    .match('*.{scss,css}', {
        useSprite: true,
        // postprocessor: [
        //     fis.plugin('autoprefixer', {
        //         browsers: ['Android >= 2.3', 'iOS >= 6'],
        //         cascade: true
        //     })
        // ]
    });

/**
 * 将page里面的页面，重命名并发布到web根目录中
 */
fis.match("/pages/(*)/*(.html)", {
    release: '/$1$2',
    useCache: false
});

/**
 * 处理 noHash
 */
noHash.forEach(function (item) {
    fis.match(item, {useHash: false});
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

/**
 * 发布上线的版本
 */
fis.project.currentMedia() === 'dist' && fis.util.del(fis.project.getProjectPath('../public'));

fis.media('dist')
    .match('*.{js,css,png,jpg,jpeg,gif,svg}', {
        useHash: true
    })
    .match('*.{css,scss}', {
        optimizer: fis.plugin('clean-css')
    })
    .match('*.{js,tpl}', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('*.min.js', {
        optimizer: null
    })
    .match('::package', {
        postpackager: [
            fis.plugin('loader', {
                resourceType: 'commonJs',
                allInOne: {
                    css: '${filepath}_aio.css',
                    js: '${filepath}_aio.js',
                }
            }),
            // fis.plugin('inline') // 将小于10KB的内容内联到html中9
        ]
    });