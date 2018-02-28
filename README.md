<pre>  
缓存库(同步)
  !!!!!!!!!(强烈建议禁止直接通过微信小程序存储api修改'light_'开头的存储对象)!!!!!!!!!
  可以通过wx._keyname获取管理的值(在app.js的第一行写wx.__isDeepCopy=true则获取的值为深拷贝的值)
  自己随意存取的通常为后缀"_" 例:wx.xxx_
  轻缓存管理的为前缀"_" 例:wx._xxx
  取到的值是null,undefined,''时,返回''
  存undefined,null:无意义
  Example:
	    const { setStorageSync, getStorageSync, removeStorageSync, setKV, getKV, delKV}=require("lib/LightCache.js")
	    setKV('key1','value1');//存储key1为value1
	    getKV('key1');//获取key1的值
	    delKV('key1');//删除存储的key1
  

  日志存储
  默认留存每个key的50条记录，FIFO类型
  example:
   let _log=require('lib/log.js')
   let log;
   Page({
       onLoad(){
       log=new _log(this);//第二个参数：是否自动删除超过的记录 可选true | false 
       //log.put('key',value);//第三个参数：是否同步存储 可选true | false 
       //log.remove();//可选参数：指定key
       //log.removeAll();//删除所有日志
       }
   })


  直接请求地址 如果没有session会自动登陆获取code并上传服务器以换取session
  Example:
   const request = require('../../lib/Request');
   Page({
       onLoad(){
           ......
           request({
           url: "YHXX",
           success(res) {
               if (res.data.result) {
                   var qfjls = JSON.parse(res.data.qfjls);
                   var userInfo = { sjh: res.data.sjh, sfzh: res.data.sfzh, userId: res.data.yhid };
                   setKV('UserInfo', userInfo);
               }
           })
           ......
       }
  })


  解析富文本 用于rich-text组件
  example:
   let parser=require('lib/tagParser.js')
   page({
       onLoad(){
           let html=....
           let nodes=parser(html)
           this.setData({
               nodes:nodes
           })
       }
   })
