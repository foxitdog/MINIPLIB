/**
 * 在Date的基础上添加格式化日期
 * @param {string} fmt 格式化日期
 * y:年份
 * M：月份
 * d：日
 * h：小时
 * m：分钟
 * s：秒
 * S：毫秒
 * 例：yyyy-MM-dd HH:mm:ss
 * @author liangyun 895423140@qq.com
 */
// {:日期格式化
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 *  在Date的基础上添加获取昨日日期
 */
Date.prototype.getYesterday=function() {
    return this.setTime(this.getTime() - 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
}


