/**
 * 配套Request使用
 * @author liangyun 895423140@qq.com
 */
let Session = require('./session');
let publicVar = require("./PublicVar");
// options:{
//     success:function(){//连接服务器获取到session
//     },
//     fail:function(){//连接服务器失败
//     }
// }
function login(options) {
    wx.loging_=true;//表示当前正在登录中
    Session.clear()
    if (wx.showLoading && wx.hideLoading) {
        wx.showLoading({
            title: '登录中',
            mask: true,
        })
    } else {
        wx.showToast({
            title: '登录中',
            icon: 'loading',
            duration: 99000,
            mask: true,
        })
    }
    wx.login({
        success: function (loginResult) {
            wx.request({
                url: publicVar.SERVER_URL + 'login', //仅为示例，并非真实的接口地址
                data: {
                    code: loginResult.code,
                    encryptedData: '',//userResult.encryptedData,
                    iv: '',//userResult.iv,
                },
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    if (wx.showLoading && wx.hideLoading) {
                        wx.hideLoading()
                    } else {
                        wx.hideToast()
                    }
                    Session.set({
                        session: res.data.session,
                    })
                    wx.session_ = {
                        session: res.data.session,
                    }//在全局存储获取的session
                    wx.isLogin_ = true; //获取到与服务进行通信的session信息,即为微信登录成功
                    wx.loging_=false;
                    if (options && options.success) {
                        options.success()
                    }
                },
                fail: function () {
                    if (wx.showLoading && wx.hideLoading) {
                        wx.hideLoading()
                    } else {
                        wx.hideToast()
                    }
                    wx.loging_=false;
                    if (options && options.fail) {
                        options.fail()
                    }

                    wx.showModal({
                        title: '网络错误',
                        confirmColor:"#3399ff",
                        content: "连接服务器超时,请稍后再试",
                        success: function (res) {
                            if (!res.confirm) {
                                login(options)
                            }
                        }
                    })

                }
            })
        },

        fail: function (loginError) {
            if (wx.showLoading && wx.hideLoading) {
                wx.hideLoading()
            } else {
                wx.hideToast()
            }
            wx.loging_=false;
            console.log(loginError)
            if (options && options.fail) {
                options.fail()
            }
            wx.showModal({
                title: '微信登录失败',
                confirmColor:"#3399ff",
                content: "请检查网络状态",
                success: function (res) {
                }
            })
        },
    });
}


// userinfo
// let userInfo = res.userInfo//
// let nickName = userInfo.nickName//昵称
// let avatarUrl = userInfo.avatarUrl//头像路径
// let gender = userInfo.gender //性别 0：未知、1：男、2：女 
// let province = userInfo.province//省
// let city = userInfo.city//城市
// let country = userInfo.country//国家


module.exports = login;