
module.exports = {
    init: function () {
        console.log('--init--');
        var self = this;

        var btn = document.getElementById('btn');

        this.addEvent(btn, function () {
            self.testRequire();
            self.testRequireAsync();
            self.testLoadJs();
            self.testLoadCss();
        });
    },
    testRequire: function () {
        /**
         * 这种方式引用，则alert不是异步加载，是同步加载的
         * 如果代码中这么写，即使没调用，也会将其一起打包，如果的确没用到，则将该require注释掉
         */
        // var Alert = require('/components/alert');
        // Alert.show('alert.js同步加载成功');
    },
    testRequireAsync: function () {
        /**
         * 这种方式引用，则alert才会异步加载，区别在于传递的是数组
         */
        require.async(['/components/alert'], function (Alert) {
            console.log('---', Alert);
            Alert.show('alert.js异步加载成功');
        });

        // 等效方式1
        // require.async('/components/alert', function (Alert) {
        //     console.log('---', Alert);
        //     Alert.show('alert.js异步加载成功');
        // });

        // 等效方式2，可以从mod.js中的源码中看得到
        // require(['/components/alert'], function (Alert) {
        //     console.log('---', Alert);
        //     Alert.show('alert.js异步加载成功');
        // });
    },
    testLoadJs: function () {
        // 异步加载脚本文件，不做任何回调，但它们返回的顺序又不确定
        require.loadJs('//cdn.bootcss.com/jquery/1.12.4/jquery.min.js');
        require.loadJs('//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js');
    },
    testLoadCss: function () {
        // 异步加载脚本文件，不做任何回调
        require.loadCss({url: '//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css'});
    },
    addEvent: function (dom, handler) {
        if (!dom) {
            return;
        }
        if (btn.addEventListener) {
            btn.addEventListener('click', handler);
        } else {
            btn.attachEvent('onclick', handler);
        }
    }
};