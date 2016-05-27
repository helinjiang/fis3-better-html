
module.exports = {
    init: function () {
        console.log('--init--');
        var self = this;

        var btn = document.getElementById('btn');

        this.addEvent(btn, function () {
            // self.testRequire();
            self.testRequireAsync();
        });
    },
    testRequire: function () {
        /**
         * 这种方式引用，则alert不是异步加载，是同步加载的
         */
        // var Alert = require('/components/alert');
        // Alert.show('alert.js同步加载成功');
    },
    testRequireAsync: function () {
        /**
         * 这种方式引用，则alert才会异步加载，区别在于传递的是数组
         */
        require(['/components/alert'], function (Alert) {
            console.log('---', Alert);
            Alert.show('alert.js异步加载成功');
        });
    },
    testLoadJs: function () {
        require.loadJs('http://mat1.gtimg.com/www/asset/lib/jquery/jquery/jquery-1.11.1.min.js');
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