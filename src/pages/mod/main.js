/**
 * Created by linjianghe on 2016/5/27.
 */
require('/components/1-0/main.js');

var btn = document.getElementById('btn');
var handler = function() {
    /**
     * 这种方式引用，则alert不是异步加载，是同步加载的
     */
    // var Alert = require('/components/alert');
    // Alert.show('alert.js同步加载成功');

    /**
     * 这种方式引用，则alert才会异步加载，区别在于传递的是数组
     */
    require(['/components/alert'], function(Alert){
        console.log('---', Alert);
        Alert.show('alert.js异步加载成功');
    });
};

if (btn.addEventListener) {
    btn.addEventListener('click', handler);
} else {
    btn.attachEvent('onclick', handler);
}