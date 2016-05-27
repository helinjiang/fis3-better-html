/**
 * ! 请勿写入业务代码
 * 和项目相关业务代码写在proj.js等中
 */
var _ = module.exports = {
    /**
     * 获取查询参数
     * @param {String} name
     * @return {String} 
     */
    query: function(name) {
        return location.search
            .match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)')) 
                ? decodeURIComponent(RegExp.$2) : '';
    },

    /**
     * 获取cookie
     * @param {String} name 
     * @return {String} 
     */
    getCookie: function(name) {
        return document.cookie
            .match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
                ? decodeURIComponent(RegExp.$2) : '';
    },

    /**
     * 获取QQ号
     * @return {Number}
     */
    uin: function() {
        var u = this.getCookie('uin');
        return u && parseInt(u.substring(1, u.length), 10) || null;
    },

    /**
     * 代码版本 为文件打包压缩之后的md5版本号
     * @type {String}
     */
    codeVersion: (function() {
        var err = window.Error && new Error();
        return (err && err.stack && err.stack.toString() || '')
            .match(/[_\-](\w{6,8})\.js\b/)
                && RegExp.$1 || '';
    })(),

    extend: function() {
        return arguments.length === 1
            ? $.extend(_, arguments[0])
            : $.extend.apply($, arguments);
    },
    
    escape: function (html, encode) {
        return html
            .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    unescape: function (html) {
        return html
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    }
};

