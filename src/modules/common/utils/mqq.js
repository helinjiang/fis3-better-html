
var _ = require('./base'),
    device = require('device');

module.exports = _.extend({
    /**
     * 调用mqq接口
     * @param {String} calls 
     * @param {Object..} args 
     * @example 
     *  _.mqq('ui.showProfile', {uin: ''})
     */
    mqq: function(calls) {
        var args = [].slice.call(arguments, 1);
        return new Promise(function(resolve, reject) {
            window['require'](['mqq'], function() {
                if (calls) {
                    var p = calls.split(/\./),
                        obj = window.mqq,
                        method = p[p.length - 1];
                    p.slice(0, -1).forEach(function(name) {
                        obj = obj[name];
                    });
                    obj[method].apply(obj, args);
                }
                resolve(window.mqq);
            }, reject);
        });
    },

    /**
     * 调用weixin接口
     * @param {Object..} args 
     */
    weixin: function() {
        var args = [].slice.call(arguments);
        return new Promise(function(resolve, reject) {
            function succ() {
                resolve && resolve(WeixinJSBridge);
                resolve = null;
            }
            if (typeof window.WeixinJSBridge == 'object' 
                && typeof window.WeixinJSBridge.invoke == 'function'
            ) {
                succ();
            } else {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', succ, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', succ);
                    document.attachEvent('onWeixinJSBridgeReady', succ);
                }
            }
        }).then(function() {
            if (args.length) {
                WeixinJSBridge.invoke.apply(WeixinJSBridge, args);
            }
            return WeixinJSBridge;
        });
    },
    
    wx: function(calls) {
        var args = [].slice.call(arguments, 1);
        return new Promise(function(resolve, reject) {
            window['require'](['wx'], function() {
                if (calls) {
                    var p = calls.split(/\./),
                        obj = window.wx,
                        method = p[p.length - 1];
                    p.slice(0, -1).forEach(function(name) {
                        obj = obj[name];
                    });
                    obj[method].apply(obj, args);
                }
                resolve(window.wx);
            }, reject);
        });
    }
});

if (device.platform === 'qq') {
    setTimeout(function() {
        _.mqq();
    }, 2000); // 自动加载mqq
}

if (device.platform === 'weixin') {
    setTimeout(function() {
        _.wx();
    }, 2000); // 自动加载mqq
}

