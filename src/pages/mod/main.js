/**
 * Created by linjianghe on 2016/5/27.
 */
require('/components/1-0/main.js');

var btn = document.getElementById('btn');
var handler = function() {
    alert('handler');
    require(['/components/2-0/main.js']);
};

if (btn.addEventListener) {
    btn.addEventListener('click', handler);
} else {
    btn.attachEvent('onclick', handler);
}