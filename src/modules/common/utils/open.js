
var _ = require('./base'),
    device = require('device'),
    fakePro = require('fake-protocol'),
    config = require('common/config');

module.exports = _.extend({
    /**
     * 返回url
     * @param {String} url
     * @return {String} 
     */
    url: function (url) {
        var prefix = location.href.replace(/[^\/]*$/, ''),
            bid = _.query('_bid'),
            wv = _.query('_wv'),
            from = _.query('from');
        if (url) {
            if (!url.match(/^(https?:)?\/\//)) {
                url = `${prefix}${url}`;
            }
            if (url.indexOf(prefix) === 0) {
                if (!url.match(/[?&]_bid=/)) {
                    url += (url.match(/\?/) ? '&' : '?') + `_bid=${bid}`;
                }
                if (!url.match(/[?&]_wv=/)) {
                    url += (url.match(/\?/) ? '&' : '?') + `_wv=${wv}`;
                }
                // 传递from
                if (!url.match(/[?&]from=/)) {
                    url += (url.match(/\?/) ? '&' : '?') + `from=${from}`;
                }
            }
        }
        return url;
    },

    /**
     * 打开连接
     * @param {String|Object} url|opt 
     */
    openUrl: function(opt) {
        if (typeof opt === 'string') {
            opt = {
                url: opt
            };
        }
        switch (device.type) {
            case 'qq':
                _.mqq('ui.openUrl', {
                    url: opt.url,
                    target: 0
                });
                break;
            default:
                window.location.href = opt.url;
                break;
        }
    },

    /**
     * 打开NOW直播
     */
    launchApp: function() {
        switch (device.type) {
            //case 'qq':
                 //qq里带上登录态
                //_.mqq('app.launchAppWithTokens', {
                    //type: 'wtlogin',
                    //appID: config.appID,
                    //packageName: config.packageName,
                    //flags: '67108864' // android 必须
                //});
                //break;
            default: 
                fakePro.call('tnow://openpage/anchor');
                break;
        }
        return _._getOpenAppStatus();
    },

    /**
     * 判断是否安装NOW直播
     * @return {Promise} 
     *  resolve(2) 已安装
     *  resolve(1) 未安装
     *  resolve(0) 不能判断
     */
    appInstalled: function() {
        return new Promise(function(resolve, reject) {
            if (device.platform === 'android') {
                switch (device.type) {
                    case 'qq':
                        _.mqq('app.isAppInstalled', config.packageName, function(res){
                            resolve(res ? 2 : 1);
                        });
                        break;
                    case 'weixin':
                        _.weixin('getInstallState', {
                            'packageUrl': config.packageName + '://',
                            'packageName': config.packageName
                        }, function(res){
                            resolve(res.err_msg.match(/yes/ig) ? 2 : 1);
                        });
                        break;
                    default:
                        resolve(0);
                        break;
                }
            } else {
                resolve(0);
            }
        });
    },

    _checkIsfromRecommand() {
        return device.platform && this.query('fromlink') === 'recommand';
    },

    /**
     * 下载app
     */
    downloadApp: function() {
        let isAndroid = device.platform === 'android';
        let url = isAndroid ? 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.now&ckey=CK1333552588841' : 'https://itunes.apple.com/app/id1097492828';
        let channel = this.query('channellink');

        //如果通过推荐页过来，则使用如下地址
        if (this._checkIsfromRecommand()) {
            url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.now&ckey=CK1333571442734';
        }

        if (isAndroid && channel) {
            url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.now&ckey=' + channel;
        }

        _.openUrl(url);
    },

    /**
     * 打开房间
     * @param {?String} roomId
     * @return {Promise} 是否成功打开app房间
     */
    openRoom: function(roomId) {
        if (!roomId) {
            return _.launchApp();
        } else {
            fakePro.call(`tnow://openpage/anchor?roomid=${roomId}`);
            return _._getOpenAppStatus();
        }
    },

    visibilityChange: function(fn) {
        switch (device.type) {
            case 'qq':
                _.mqq('addEventListener', 'qbrowserVisibilityChange', function(e) {
                    fn(e.hidden ? 'hidden' : 'visible');
                });
                break;
            case 'weixin':
                _.weixin().then(function() {
                    WeixinJSBridge.on('activity:state_change', function(res) {
                        fn(res && res.state == 'onResume' ? 'visible' : 'hidden');
                    });
                });
                break;
            default:
                document.addEventListener('webkitvisibilitychange', function() {
                    fn(document.visibilityState);
                });
                break;
        }
    },

    /**
     * 判断是否成功打开app
     * @return {Promise} 
     */
    _getOpenAppStatus: function() {
        // 判断页面是否被app覆盖判断
        var visibilityClue = new Promise(function(resolve, reject) {
            var fn = function(result) {
                result = result || document.visibilityState || '';
                if (result.match(/hidden/i)) {
                    resolve();
                } else {
                    reject();
                }
                fn = null;
            };
            _.visibilityChange(function(result) {
                fn && fn(result);
            });
            setTimeout(function() {
                fn && fn();
            }, 500);
        });
        // 先直接判断是否安装app, 失败时使用app覆盖的判断
        return _.appInstalled()
            .then(function(result) {
                if (result === 0) {
                    return visibilityClue;
                } else if (result !== 2) {
                    return Promise.reject();
                }
            });
    },

    /**
     * 打开房间页面
     * @param {String} roomId
     */
    openRoomPage: function(roomId, opt) {
        opt = opt || {};
        let url = `//now.qq.com/h5/index.html?_bid=2336&_wv=16778241&roomid=${roomId}`;

        if (opt.from) {
            url += `&from=${opt.from}`
        }

        if (this._checkIsfromRecommand()) {
            url += '&fromlink=recommand';
        }

        let channellink = this.query('channellink');

        if (channellink) {
            url += '&channellink=' + channellink;
        }

        window.location.replace(_.url(url));
    }
});

