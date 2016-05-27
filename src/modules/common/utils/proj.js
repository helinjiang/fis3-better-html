
var _ = require('./base'),
    util = require('util');

module.exports = _.extend({
    /**
     * 返回相应尺寸图片url
     * @param {String} url
     * @param {Number} size 
     * @param {String} svr 
     * @return {String} 
     */
    pic: function(url, size, svr, useRaw) {
        if (url) {
            // 去除协议头
            url = url.replace(/^https?:/, '');
            if (/\.(png|jpg|jpeg|gif)$/.test(url) || url.match(/\?/)) {
                return url;
            }
            if (size) {
                if (url.indexOf('hy_personal_room') !== -1) {
                    // hy_personal_room 只有640
                    size = 640;
                }
                url = url.replace(/(\/\d*)?$/, '/' + size);
            }
            // webp
            if (util.webp.supportedWebP) {
                url = url + (url.match(/\?/) ? '&' : '?') + 'tp=webp';
            }
            // http
            if (useRaw) {
                url = url.match(/^http/) ? url : `http:${url}`; // 补上http
                url = url.replace(/\?.*/, ''); // 去除webp参数
            }
        }
        return url;
    }
});

