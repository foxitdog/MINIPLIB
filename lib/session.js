/**
 * session控制
 * @author liangyun 895423140@qq.com
 */
const { setKV, getKV, delKV } = require("LightCache.js")

let Session = {
    get: function () {
      return getKV("SESSION");
    },

    set: function (session) {
      setKV("SESSION", session);
    },

    clear: function () {
      delKV("SESSION");
    },
};

module.exports = Session;