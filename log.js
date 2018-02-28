/**
 * 日志存储
 * 默认留存每个key的50条记录，FIFO类型
 * example:
 *  let _log=require('lib/log.js')
 *  let log;
 *  Page({
 *      onLoad(){
 *      log=new _log(this);//第二个参数：是否自动删除超过的记录 可选true | false 
 *      //log.put('key',value);//第三个参数：是否同步存储 可选true | false 
 *      //log.remove();//可选参数：指定key
 *      //log.removeAll();//删除所有日志
 *      }
 *  })
 * @author liangyun 895423140@qq.com
 */
function log(page = '', autoDelete = true) {
    if (page instanceof Boolean) {
        autoDelete = page;
        page = '';
    }
    this.init(page);
    this.autoDelete = autoDelete;
}
log.prototype.init = function (page) {
    this.key = "noName";
    if (page && typeof page == 'object') {
        if (page.hasOwnProperty("route")) {
            this.key = page['route'];
        } else {
            throw new Error("传入的不是page对象");
        }
    } else if (page && typeof page == 'string') {
        this.key = page;
    }
}
/**
 * 删除日志
 * 没有参数 就删除默认的key
 * function ([key]){}
 * key 要删除的key
 * 
 */
log.prototype.remove = function (key = '') {
    let that = this;
    key = key ? key : this.key;

    let log = wx.getStorageSync("log");
    if (log == '') {
        log = { [key]: [] };
    }
    if (log.hasOwnProperty(key)) {
        log[key] = [];
    }
    wx.setStorageSync("log", log);
}
/**
 * 删除所有日志
 */
log.prototype.removeAll = function () {
    wx.setStorageSync("log", '');
}
/**
 * 添加日志 一个参数就是以page作为存储key 参数做value sync=true
 *         两个参数就是 key -- value 和 value -- sync 组合
 */
log.prototype.put = function (key, value, sync = true) {
    let that = this;
    if (arguments.length == 2 && typeof arguments[1] == 'boolean') {
        sync = arguments[1];
        value = arguments[0];
        key = this.key;
    } else if (arguments.length == 1) {
        value = arguments[0];
        key = this.key ? this.key : 'noName';
    }
    if (sync) {
        let log = wx.getStorageSync("log");
        if (log == '') {
            log = { [key]: [] };
        }
        if (!log.hasOwnProperty(key) || !(log[key] instanceof Array)) {
            log[key] = [];
        } else {
            if (!wx.debug_) {
                let length = log[key].length
                if (length > 50 && this.autoDelete) {
                    log[key].slice(0, length - 49);
                }
            }
        }
        let string = new Date().format('yyyy-MM-dd HH:mm:ss') + " " + value
        log[key].push(string);
        wx.setStorageSync("log", log);
        if (wx.debug_) {
            console.log(string)
        }
    } else {
        wx.getStorage({
            key: 'log',
            success: function (res) {
                let log = res.data;
                if (log == '') {
                    log = { [key]: [] };
                }
                if (!log.hasOwnProperty(key)) {
                    log[key] = [];
                }
                let string = new Date().format('yyyy-MM-dd HH:mm:ss') + " " + value
                log[key].push(string);
                if (wx.debug_) {
                    console.log(string)
                }
                wx.setStorage({
                    key: "log",
                    data: log
                });
            },
            fail(error) {
                that.put(key, "获取缓存出错");
            }
        })
    }
}
/**
 * 添加日志 一个参数就是以page作为存储key 参数做value sync=true
 *         两个参数就是 key -- value 和 value -- sync 组合
 */
log.prototype.debug = function (key, value, sync = true) {
    if (wx.debug_) {
        let that = this;
        if (arguments.length == 2 && typeof arguments[1] == 'boolean') {
            sync = arguments[1];
            value = arguments[0];
            key = this.key ? this.key : 'noName';
        } else if (arguments.length == 1) {
            value = arguments[0];
            key = this.key ? this.key : 'noName';
        }
        key = key + '_debug';
        this.put(key, value, sync)
    }
}
/**
 * 获取日志 一个参数 就是同步获取 两个参数就是一步获取
 */
log.prototype.get = function (key, callback) {
    let that = this
    if (!callback) {
        let log = wx.getStorageSync("log");
        if (log == '' || !log.hasOwnProperty(key)) {
            return [];
        }
        return log[key];
    } else if (typeof callback == 'function') {
        wx.getStorage({
            key: 'log',
            success: function (res) {
                let log = res.data;
                if (log == '' || !log.hasOwnProperty(key)) {
                    callback([]);
                    return;
                }
                callback(log[key]);
                return;
            },
            fail(error) {
                that.put(key, "获取缓存出错");
            }
        })
    } else {
        that.put(key, "获取缓存出错");
    }
}
module.exports = log;