/**
 * 缓存库(同步)
 * !!!!!!!!!(强烈建议禁止直接通过微信小程序存储api修改'light_'开头的存储对象)!!!!!!!!!
 * 
 * 可以通过wx._keyname获取管理的值(在app.js的第一行写wx.__isDeepCopy=true则获取的值为深拷贝的值)
 *
 * 自己随意存取的通常为后缀"_" 例:wx.xxx_
 * 轻缓存管理的为前缀"_" 例:wx._xxx
 *
 * 取到的值是null,undefined,''时,返回''
 * 存undefined,null:无意义
 * Example:
 *   const { setStorageSync, getStorageSync, removeStorageSync, setKV, getKV, delKV}=require("lib/LightCache.js")
 *   setKV('key1','value1');//存储key1为value1
 *   getKV('key1');//获取key1的值
 *   delKV('key1');//删除存储的key1
 * 
 * @author liangyun 895423140@qq.com
 */

/**
 * 轻量级缓存(同步)
 * @param {boolean} isDeepCopy true:通过get函数获取的是深度拷贝的值 false:通过get函数获取的是引用
 */
function LightCache(isDeepCopy) {
  let that = this;
  this.isDeepCopy = isDeepCopy || false;
  this.keys = {};
  this.setStorageSync = setStorageSync;
  this.getStorageSync = getStorageSync;
  this.removeStorageSync = removeStorageSync;
  let keys = wx.getStorageInfoSync().keys;
  for (let key of keys) {
    /*
      以light_开头的key为缓存库控制的key
    */
    if (key.startsWith("light_")) {
      let keyname = key.replace('light_', '');
      let value = wx.getStorageSync(key) || '';
      this.keys[keyname] = value;
      console.log('lightkey:' + keyname)
      /*
        设置get方法
      */
      Object.defineProperty(wx, "_" + keyname, {
        get() {
          if (that.isDeepCopy)
            return JSON.parse(JSON.stringify(that.keys[keyname]));
          else
            return that.keys[keyname];
        }
      })
    }
  }
}
/**
 * 存储key，value到系统中并纳入存储管理
 * @param {string} key 键名
 * @param {*} data 数据
 */
function setStorageSync(key, data) {
  let that = this;
  this.keys[key] = data;
  wx.setStorageSync('light_' + key, data)
  if (!wx.hasOwnProperty("_" + key)) {
    console.log('lightkey:' + keyname)
    Object.defineProperty(wx, "_" + key, {
      get() {
        if (that.isDeepCopy)
          return JSON.parse(JSON.stringify(that.keys[keyname]));
        else
          return that.keys[key];
      }
    })
  }
}
/**
 * 获取指定键值
 * @param {string} key 键名
 */
function getStorageSync(key) {
  let that = this;
  let value = this.keys[key];
  if (value == undefined) {
    let keys = wx.getStorageInfoSync().keys;
    let k_index = keys.findIndex(key);
    if (k_index < 0) {
      return '';
    } else {
      value = wx.getStorageSync(key) || ''
      this.keys[key] = data;
      wx.setStorageSync('light_' + key, value);
      Object.defineProperty(wx, "_" + key, {
        get() {
          if (that.isDeepCopy)
            return JSON.parse(JSON.stringify(that.keys[keyname]));
          else
            return that.keys[key];
        }
      })
      if (that.isDeepCopy)
        return JSON.parse(JSON.stringify(value));
      else
        return value;
    }
  } else {
    if (that.isDeepCopy)
      return JSON.parse(JSON.stringify(value));
    else
      return value;
  }
}
/**
 * 删除指定的键值存储 会删除存储中的相关键值
 * @param {string} key 键名
 */
function removeStorageSync(key) {
  this.keys[key] = undefined
  wx.removeStorageSync('light_' + key)
}

const cache = new LightCache(wx.__isDeepCopy);
wx.LightCache = cache;

exports.setStorageSync = setStorageSync.bind(cache);
exports.getStorageSync = getStorageSync.bind(cache);
exports.removeStorageSync = removeStorageSync.bind(cache);
exports.setKV = setStorageSync.bind(cache);
exports.getKV = getStorageSync.bind(cache);
exports.delKV = removeStorageSync.bind(cache);