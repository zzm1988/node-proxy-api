/**
 * Created by zzm on 2017/07/26.
 */

module.exports = { 
  //工程使用端口
  PORT : 3000,

  // BASE_API : "", //外网测试地址
  // BASE_API : "",  //外网正式环境
  BASE_API : "http://127.0.0.1:10000", //本地测试地址

  //TS_KEY
  TS_KEY : "xxxxx",

  /**
   * 通用接口URL和提示字符串
   *
  */
  URLANDALERTSTRING : [
    //登录接口URL（例子）
    { "url" : "loginNew", 
      "alertstring" : "loginNew"
    }
    
  ]

}