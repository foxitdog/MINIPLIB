/**
 * 直接请求地址 如果没有session会自动登陆获取code并上传服务器以换取session
 * Example:
 *  const request = require('../../lib/Request');
 *  Page({
 *      onLoad(){
 *          ......
 *          request({
 *          url: "YHXX",
 *          success(res) {
 *              if (res.data.result) {
 *                  var qfjls = JSON.parse(res.data.qfjls);
 *                  var userInfo = { sjh: res.data.sjh, sfzh: res.data.sfzh, userId: res.data.yhid };
 *                  setKV('UserInfo', userInfo);
 *              }
 *         
 *          })
 *          ......
 *      }
 * })
 * @author liangyun 895423140@qq.com
 */

//------------------------------
// wx.(xxxx)_ 代表的是自定义的一个xxxx属性，通过wx对象来传值
//------------------------------

let Session = require('./session');
let login = require('./login');
let publicVar = require("./PublicVar");

// let _Arguement = '';
// let _that = '';
/**
 *  执行请求的函数 其中可以传入this getData.call(that,...xxx)
 * @param {Object} options 
 * url 为请求地址 例：/xxx/xx // 
 * data 例：{} // 
 * method GET/POST // 
 * isBarLoading //显示标题栏加载样式 不是toast加载样式 //
 * loadMessage //loadingToast 的文字
 * success function // 
 * fail function // 
 * complete function 必定执行的函数
 * @param {function} success 成功的回调
 * @param {function} fail 失败的回调
 * @param {function} complete 成功、失败都执行的回调
 */
let getData = function (options, success, fail, complete) {
    let that = this
    if (!that) {
        that = {}
    }

    that.barLoadingC = 0 //barLoading计数
    that.toastC = 0 //toast计数
    let args = arguments
    // _that = that
    // _Arguement = arguments
    if (wx.loging_) {
        setTimeout(function () {
            getData.apply(that, args);
        }, 2);
        return
    }
    if (!wx.isLogin_) {
        login({
            success() {
                getData.apply(that, args);
            }
        })
        return;
    }


    let url = publicVar.SERVER_URL + options.url;

    let data = options.data || {};

    let session = Session.get()
    Object.assign(data, {
        session: session.session
    })

    let header = {
        'content-type': 'application/x-www-form-urlencoded'
    };

    if (options.header) {
        Object.assign(header, options.header)
    }
    let method = options.method || 'POST';
    let isBarLoading = options.isBarLoading;
    if (isBarLoading) {
        that.barLoadingC++
            wx.showNavigationBarLoading()
    } else {
        that.toastC++
            wx.showToast({
                title: options.loadMessage || '加载中',
                icon: 'loading',
                duration: 99000,
                mask: true,
            })
    }
    wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        success: function (res) {
            if (isBarLoading) {
                that.barLoadingC--
                    if (that.barLoadingC == 0)
                        wx.hideNavigationBarLoading()
            } else {
                that.toastC--
                    if (that.toastC == 0)
                        wx.hideToast()
            }
            if (res.data.error && res.data.error.code > 0) {
                errorHandler(that, res.data.error, arguments)
                return; //可以return 
            } else if (res.data.error) {
                console.log(res.data.error)
            }
            if (options.success && typeof options.success == "function") {
                options.success.apply(that, arguments)
            } else if (success && typeof success == "function") {
                success.apply(that, arguments)
            }
        },
        fail: function (obj) {
            if (isBarLoading) {
                that.barLoadingC--
                    if (that.barLoadingC == 0)
                        wx.hideNavigationBarLoading()
            } else {
                that.toastC--
                    if (that.toastC == 0)
                        wx.hideToast()
            }

            wx.showModal({
                title: '网络错误',
                content: "连接服务器超时",
                success: function (res) {
                    if (res.confirm) {}
                }
            })
            if (options.fail && typeof options.fail == "function") {
                options.fail.apply(that, arguments)
            } else if (fail && typeof fail == "function") {
                fail.apply(that, arguments)
            }
        },
        complete: function () {
            if (isBarLoading) {
                that.barLoadingC--
                    if (that.barLoadingC == 0)
                        wx.hideNavigationBarLoading()
            } else {
                that.toastC--
                    if (that.toastC == 0)
                        wx.hideToast()
            }
            if (options.complete && typeof options.complete == "function") {
                options.complete.apply(that, arguments)
            } else if (complete && typeof complete == "function") {
                complete.apply(that, arguments)
            }
        }
    })
}
/*
code:
1:重新登录
2:弹窗显示
message：
附带的信息
*/
let errorHandler = function (that, error, arguments_) {
    switch (error.code) {
        // case 1:
        //     // 登陆的操作 //暂时不启用
        //     wx.isLogin_=false
        //     login.call(that,{
        //         success() {
        //             getData.apply(that,arguments);
        //         }
        //     })
        //     break;
        case 2:
            wx.showModal({
                title: '错误',
                content: error.message,
                success: function (res) {
                    if (res.confirm) {}
                }
            })
            break;
        case 3:
            wx.removeStorageSync('accountInfo');
            if (wx.reLaunch) {
                wx.reLaunch({
                    url: '/page/login/login?message=' + error.message
                })
            } else {
                let pages = getCurrentPages().length
                if (pages > 1) {
                    wx.navigateBack({
                        delta: pages,
                        success() {
                            wx.redirectTo({
                                url: '/page/login/login?message=' + error.message
                            })
                        }
                    })
                } else {
                    wx.redirectTo({
                        url: '/page/login/login?message=' + error.message
                    })
                }
            }
        default:
            break;
    }
}

module.exports = getData;