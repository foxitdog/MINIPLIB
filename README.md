<pre>  
 * 缓存库(同步)
 * 
 * 微信小程序对于数据的本地存储是调用的wx.setStorage..系列的api,而每次的不同页面的获取又需要重新进行进行wx.getStorage..的系列操作;
 * 而使用了该缓存库后,可以实现:
 * 1.一次存储,后面的所有的获取键值的操作都不在是每次都直接调用的wx.getStorage..系列的api进行,而是直接返回缓存的最新键值
 * 2.获取值时不需要再通过wx.getStorage..操作 而是可以直接调用wx._(key)来进行获取
 * 
 * 使用的注意点:
 * 1.强烈建议禁止直接通过微信小程序存储api修改'light_'开头的存储对象
 * 2.要使缓存库起作用,请注意在app.js的开头就要引用该库 即:require("lib/LightCache.js")
 * 3.wx._(key)正常情况下是无法修改键值的,内部机制是通过getter方法获取,且没有setter方法的
 * 4.wx._(key),getKV,getgetStorageSync在不是深拷贝的情况下,请不要随意的修改引用对象内部的值 以防止打乱缓存的内部管理
 * 5.wx._(key),getKV,getgetStorageSync在深拷贝的情况下,修改引用对象内部的值是不在后续的wx._(key)中生效的
 * 6.在app.js的第一行写wx.__isDeepCopy=true则获取的值为深拷贝的值
 *
 * 轻缓存管理的为前缀"_" 例:wx._xxx
 *
 * 取到的值是null,undefined,''时,返回''
 * 存undefined,null:无意义
 * Example:
 *   const { setStorageSync, getStorageSync, removeStorageSync, setKV, getKV, delKV}=require("lib/LightCache.js")
 *   setKV('key1','value1');//存储key1为value1
 *   getKV('key1');//获取key1的值
 *   wx._key1//获取key1的值
 *   delKV('key1');//删除存储的key1
  

 * 日志存储库
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

 * 数据请求
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

 * 解析富文本 用于rich-text组件
 * example:
 *  let parser=require('lib/tagParser.js')
 *  page({
 *      onLoad(){
 *          let html=....
 *          let nodes=parser(html)
 *          this.setData({
 *              nodes:nodes
 *          })
 *      }
 *  })
</pre>