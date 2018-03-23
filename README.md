# wechat_helper
key parts of wechat sdk implementation for nodejser

分享给nodejs开发者的微信sdk关键集成代码

# notes
The document and sdk of wechat are useful for our nodejsers, but there are still some obstacles for us, that's what I'm doing: share some codes with you to avoid repeat mistakes when coding with wechat api.

微信的文档虽然全面，但其中也不乏错误之处，身为nodejs开发人员，在使用微信文档和集成sdk时踩过的一些坑，分享给大家，提供一些关键代码，仅供参考。

# contents
1，微信支付HTTPS服务器证书验证（DigiCert）

**缘起:** 微信支付HTTPS服务器证书的根证书将于2018-08-23日到期，微信支付计划于2018-05-29日更换服务器证书。技术开发人员需要尽快完成相关验证，确保安装新的根证书，以免影响正常交易。详细流程可参考[《微信支付HTTPS服务器证书验证指引》](https://pay.weixin.qq.com/wiki/doc/api/micropay.php?chapter=23_4)。

**踩坑指南:** 根据指引文档，需要提前验证客户端是否支持了DigiCert的证书。

采用方式一：调用微信支付沙箱环境的API接口验证。当返回结果return_code为“SUCCESS”，说明当前客服端已支持DigCert证书，反之则需要根据安装证书部分的指引，升级证书。

但是文档这里有个bug：**参数少了一个pay_key**（此参数可以在商户平台查到），如果少传了这个参数，就会报错FAIL：**获取沙箱密钥失败，确认交易密钥是否正确**，这样就永远获取不到SUCCESS的返回值了，是不是挺坑的。

还好我有之前的集成经验，试着传了pay_key，就能得到正确结果了，关键代码分享出来，wxVerifyDigCert.js，给大家参考。
