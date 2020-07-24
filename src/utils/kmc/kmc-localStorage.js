// 本地存储函数
import KmcConstants from './kmc-constants';
import KmcInteraction from './kmc-interaction';
import bd_storage from "../bd_storage";
import KmsSM4 from "./kms-sm4";
import Base64 from "./kmc-base64";
import Encode from "./kmc-utf8";
import $ from 'jquery';
import CryptoJS from 'crypto-js';
import Tip from "../../components/tip";

export default {
    KmcConstantsKeys: KmcConstants.KDS_KEY,
    // 该值在常量里面取出
    encryptMsg: KmcConstants.encrypt,
    inputType: "common",
    inputBusiness: "biz",
    /**
     * 设置本地存储数据
     * @param {[type]} inputKey   [键名]
     * @param {[type]} inputvalue [键值]
     * @param {[type]} from  [来源 0: android 1: ios]
     * @param {[type]} inputType
     * @param {[type]} inputBusiness
     */
    setLocalData: async function (inputKey, inputvalue, from, inputType = this.inputType, inputBusiness = this.inputBusiness) {
        // inputvalue = typeof (inputvalue) == "string" ? inputvalue : JSON.stringify(inputvalue);
        // if (this.isEncryptedField(inputKey)) {
        //     // console.log(['加密前：key=', key, '，value=', value].join(''));
        // inputvalue = this.encryptData(inputvalue);
        //     // console.log(['加密后：key=', key, '，value=', value].join(''));
        // }
        await window.AlipayJSBridge && window.AlipayJSBridge.call('setAPDataStorage', {
            type: inputType,
            business: inputBusiness,
            key: inputKey,
            value: inputvalue
        }, function (result) {
            KmcInteraction.log("设置数据(方法:setLocalData):" + JSON.stringify(result));
            KmcInteraction.log("inputType:" + inputType);
            KmcInteraction.log("inputBusiness:" + inputBusiness);
            KmcInteraction.log("inputKey:" + inputKey);
        });
    },

    /**
     * 异步获取数据的方法
     * @param {*} inputKey
     * @param {*} inputType
     * @param {*} inputBusiness
     */
    getApDataPromise: function (inputKey, inputType = this.inputType, inputBusiness = this.inputBusiness) {
        return new Promise(function (resolve, reject) {
            window.AlipayJSBridge && window.AlipayJSBridge.call('getAPDataStorage', {
                type: inputType,
                business: inputBusiness,
                key: inputKey
            }, function (t) {
                KmcInteraction.log("获取数据(方法:getApDataPromise):");
                KmcInteraction.log("inputKey:" + inputKey);
                KmcInteraction.log("inputType:" + inputType);
                KmcInteraction.log("inputBusiness:" + inputBusiness);
                resolve(bd_storage.objectification(inputKey, t.data));
            });
        });
    },
//     /**
//      * 自定义超时函数
//      * @param {*} ms
//      */
//     selfTimeout: function (ms) {
//         let delayInfo = {
//             timeoutMsg: '请求超时'
//         }
//         return new Promise((resolve, reject) => {
//             setTimeout(function () {
//                 reject(delayInfo)
//             }, ms)
//         })
//     },
//     // 定义上传文件接口函数
//     getApDataTimeLimit: function (inputKey, inputType, inputBusiness) {
//         return Promise.race([
//             this.getApDataPromise(inputKey, inputType, inputBusiness),
//             this.selfTimeout(10000) // 10秒超时
//         ])
//     },
//     /**
//      * 获取本地存储数据
//      * @param  {[type]} inputKey [键值]
//      * @param {[type]} inputType
//      * @param {[type]} inputBusiness
//      */
//     getLocalData: async function (inputKey, inputType = this.inputType, inputBusiness = this.inputBusiness) {
//         if (!window.AlipayJSBridge) {
//             KmcInteraction.log("获取数据失败(方法:getLocalData)" + ",(key:" + inputKey + "):" + KmcConstants.errorCode.APCode1);
//             return Promise.reject(KmcConstants.errorCode.APCode1);
//         }
//         try {
//             let val = await this.getApDataTimeLimit(inputKey, inputType, inputBusiness);
//             //let res = JSON.stringify(val);
//             if (val) {
//                 if (this.isEncryptedField(inputKey)) {
//                     val = this.decryptData(val, this.encryptMsg.key, this.encryptMsg.iv, this.encryptMsg.type || 0);
//                 }
//                 if (val instanceof Object) {//js对象或数组
//                     //do nothing
//                 } else if (val.toString().indexOf('[') !== -1 || val.toString().indexOf('{') !== -1) {// 如果获取的值是JSON数组或JSON字符串,转为json对象
//                     val = JSON.parse(val);
//                 } else {//返回字符串
//                     val = val.trim();
//                 }
//             }
//             KmcInteraction.log("获取数据成功(方法:getLocalData)" + ",(key:" + inputKey + "):" + JSON.stringify(val));
//             return val;
//         } catch (errInfo) {
//             KmcInteraction.log("获取数据失败(方法:getLocalData)" + ",(key:" + inputKey + "):" + errInfo);
//             return Promise.reject(KmcConstants.errorCode.APCode2);
//         }
//     },
    /**
     * 获取国密算法的密钥
     * @return {[type]} [description]
     */
    getEncrypt: function () {
        if (this.encryptMsg != null) {
            return;
        }
        let key = KmcConstants.KDS_KEY.KDS_ENCRYPT_DATA;
        let result = "";
        $.ajaxSettings.async = false;
        window.AlipayJSBridge && window.AlipayJSBridge.call('getAPDataStorage', {
            type: this.inputType,
            business: this.inputBusiness,
            key: key
        }, function (t) {
            result = t.data;
        });
        $.ajaxSettings.async = true;
        if (result) {
            // 如果获取的值是数组或对象,则返回json对象
            if (result.indexOf('[') !== -1 || result.indexOf('{') !== -1) {
                this.encryptMsg = JSON.parse(result);
            } else {
                this.encryptMsg = result.trim();
            }
        }
    },
    /**
     * 数据加密
     * @param  {[type]} data [加密数据]
     * @param  {[type]} key  [加密密钥]
     * @param  {[type]} iv   [初始化向量]
     * @param  {[type]} type [加密类型：0 表示不加密，1 表示3des加密， 2 表示SM4_ECB加密，3 表示SM4_CBC加密]
     */
    encryptData: function (data, key, iv, type) {
        key = key || this.encryptMsg.key;
        iv = iv || this.encryptMsg.iv;
        type = type || (this.encryptMsg.type ? this.encryptMsg.type : 0);

        if (typeof (data) == 'object') {
            data = JSON.stringify(data);
        }
        let result;
        switch (type) {
            case 0: //不加密
                return data;
                break;
            case 1: //3DES加密
                if (key != null && key.length > 0 && typeof (CryptoJS) != "undefined") {
                    //对密钥进行Base64解密
                    //Converts a Base64 string to a word array
                    key = CryptoJS.enc.Base64.parse(key);
                } else {
                    return data;
                }
                //Converts a UTF-8 string to a word array
                let iv = CryptoJS.enc.Utf8.parse("");
                //进行3DES加密
                result = CryptoJS.TripleDES.encrypt(data, key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }).toString();
                break;
            case 2: //SM4_ECB加密
                //对密钥进行Base64解密
                key = window.atob(key);
                result = KmsSM4.crypt_ecb(Encode.parse(data), Encode.parse(key), true);
                //将字节数组进行Base64编码
                result = Base64.fromByteArray(result);
                break;
            case 3: //SM4_CBC加密
                //对密钥进行Base64解密
                key = window.atob(key);
                //对初始化向量进行Base64解密
                iv = window.atob(iv);
                result = KmsSM4.crypt_cbc(Encode.parse(data), Encode.parse(key), Encode.parse(iv), true);
                //将字节数组进行Base64编码
                result = Base64.fromByteArray(result);
                break;
        }
        // console.log("[入参密文] " + result);
        return result;
    },
    /**
     * 数据解密
     * @param  {[type]} data [解密数据]
     * @param  {[type]} key  [加密密钥]
     * @param  {[type]} iv   [初始化向量]
     * @param  {[type]} type [加密类型：0 表示不加密，1 表示3des加密， 2 表示SM4_ECB加密，3 表示SM4_CBC加密]
     */
    decryptData: function (data, key, iv, type) {
        // console.log("[出参密文] " + data);
        let result;
        key = key || this.encryptMsg.key;
        iv = iv || this.encryptMsg.iv;
        type = type || (this.encryptMsg.type ? this.encryptMsg.type : 0);
        if (type === 0) {//不解密
            return data;
        } else if (type === 1) {//3DES解密
            if (key != null && key.length > 0 && typeof (CryptoJS) != "undefined") {
                //对密钥进行Base64解密
                //Converts a Base64 string to a word array
                key = CryptoJS.enc.Base64.parse(key);
            } else {
                return data;
            }
            //Converts a UTF-8 string to a word array
            let iv = CryptoJS.enc.Utf8.parse("");
            //进行3DES解密
            result = CryptoJS.TripleDES.decrypt(data, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);
        } else if (type === 2) {//SM4_ECB解密
            //对密钥进行Base64解密
            key = window.atob(key);
            //对密文进行Base64解密
            data = Base64.toByteArray(data);
            result = KmsSM4.crypt_ecb(data, Encode.parse(key), false);
            let index = result.indexOf(0);
            if (index !== -1) {
                result = result.slice(0, index);
            }
            //将字节数组转成字符串
            result = Encode.stringify(result);
        } else if (type === 3) {
            let iv;//SM4_CBC解密
            //对密钥进行Base64解密
            key = window.atob(key);
            //对初始化向量进行Base64解密
            iv = window.atob(iv);
            //对密文进行Base64解密
            data = Base64.toByteArray(data);
            result = KmsSM4.crypt_cbc(data, Encode.parse(key), Encode.parse(iv), false);
            let index = result.indexOf(0);
            if (index !== -1) {
                result = result.slice(0, index);
            }
            //将字节数组转成字符串
            result = Encode.stringify(result);
        }
        return result;
    },
//     /**
//      * SM4_ECB 加密
//      * @param  {[type]} data [原始数据]
//      * @param encryptKey
//      * @return {[type]}      [加密数据]
//      */
//     encryptDataECB: function (data, encryptKey) {
//         // const encryptKey = key || (this.getLocalData(KmcConstants.appKey.KDS_ENCRYPT_KEY) || {}).sm4Key || '';
//         if (encryptKey === '') {
//             console.log("encryptkey为空");
//             return data;
//         }
//         let result = '';
//         //sm4加密
//         result = KmsSM4.crypt_ecb(Encode.parse(data), Encode.parse(encryptKey), true);
//         //将字节数组进行Base64编码
//         result = Base64.fromByteArray(result);
//         return result;
//     },
//     /**
//      * 清除本地存储数据
//      * @param inputKey
//      * @param inputType
//      * @param inputBusiness
//      */
//     removeLocalData: function (inputKey, inputType = this.inputType, inputBusiness = this.inputBusiness) {
//         window.AlipayJSBridge && window.AlipayJSBridge.call('removeAPDataStorage', {
//             type: inputType,
//             business: inputBusiness,
//             key: inputKey
//         }, function (result) {
//             console.log(JSON.stringify(result));
//         });
//     },
//     /**
//      * 清空本地存储数据
//      * @return {[type]} [description]
//      */
//     clearLocalData: function () {
//         //window.localStorage.clear();
//     },
//     /**
//      * 是否是加密字段
//      * @param  {[type]}  key [description]
//      * @return {Boolean}     [description]
//      */
//     isEncryptedField: function (key) {
//         return KmcConstants.ENCRYPTED_FIELD.indexOf(key) > -1;
//     },
//     // 保存或更新数据到原生里
//     saveOrUpdateLocalData: function (inputKey, inputValue) {
//         if (KmcConstants.h5Key.hasOwnProperty(inputKey)) {
//             this.setLocalData(inputKey, inputValue);
//         }
//     },
//     // 取得cookie
//     getCookie: function (key) {
//         // 取cookie
//         let cookie = document.cookie;
//         let arr = cookie.split("; ");
//         let obj = {};
//         arr.forEach(function (ele) {
//             let subarr = ele.split("=");
//             obj[subarr[0]] = unescape(subarr[1]);
//         })
//         // 判断
//         return obj[key] ? obj[key] : "";
//     },
//     // 清除cookie
//     clearCookie: function (key) {
//         this.setCookie(key, "", -1);
//     },
//     // 设置cookie
//     setCookie: function (key, value, options) {
//         let seconds = options.seconds || 0;   //seconds有值就直接赋值，没有为0
//         let expires = "";
//         if (seconds !== 0) {      //设置cookie生存时间
//             let date = new Date();
//             date.setTime(date.getTime() + (seconds * 1000));
//             expires = "; expires=" + date.toGMTString();
//         }
//         document.cookie = key + "=" + escape(value) + expires + "; path=/" + "; domain=.h5app.com";   //转码并赋值
//         console.log("cookie的值为:" + document.cookie);
//     }
};
