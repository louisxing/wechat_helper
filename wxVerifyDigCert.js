var Sync = require('sync');
var request = require('request');
var underScore = require('underscore');
var md5 = require('md5');
var xml2js = require('xml2js');


function wxVerifyDigCert(req, res) {
    Sync(function () {
        try{
            var url = "https://apitest.mch.weixin.qq.com/sandboxnew/pay/getsignkey";
            var nonce_str = _generateNonceStr();
            var args={mch_id:WX_CONFIG.mch_id,nonce_str:nonce_str,sign:""};
            args.sign=_getSign(args);
            //console.log(args);
            var result = request.post.sync(null,{url:url,form:_buildXml(args)});
            console.log(result[0].body);
            return res.json({code:200,msg: "SUCCESS"});
        }catch (err){
            console.error(err);
            res.json({code:300,error: err.toString()});
        }
    });
}

function _generateNonceStr(length){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = '';
    var i;
    for (i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}

function _objToQueryString (object){
    return Object.keys(object).filter(function (key) {
        return object[key] !== undefined && object[key] !== '';
    }).sort().map(function (key) {
        return key + '=' + object[key];
    }).join('&');
}

function _getSign(args) {
    args = underScore.clone(args);
    delete args.sign;
    var string1 = _objToQueryString(args);
    var stringSignTemp = string1 + '&key='+WX_CONFIG.pay_key;
    var signValue = md5(stringSignTemp).toUpperCase();
    return signValue;
}

function _buildXml(obj) {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject({xml:obj});
    return xml;
};

exports.wxVerifyDigCert = wxVerifyDigCert;