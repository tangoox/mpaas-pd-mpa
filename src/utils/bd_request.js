import axios from 'axios';
import {Toast} from 'antd-mobile';
import $ from 'jquery';
import md5 from 'js-md5';
import bd_utils from "./bd_utils";
import Tip from "../components/tip";
import CONSTANTS from "./constants";
import bd_response_filter from "./bd_response_filter";

const hostMapper = {
    "/api": CONSTANTS.BaseHost,
    "/local": process.env.PUBLIC_URL
};

/* 加载本地资源 */
export function filePublicService(proxyName, url, success, fail) {
    proxyName = hostMapper[proxyName];
    $.ajax({
        url: proxyName + url,
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    });
}

/**
 * 通用请求
 * @param method     请求方法
 * @param proxyName  代理名称
 * @param url        请求地址
 * @param params     请求参数
 * @param success    成功执行函数
 * @param fail       失败执行函数
 * @param option     请求选项(postbody等需要添加请求头,有特殊定制的时候添加)
 * @param filter     是否进行统一过滤(默认为ture,会对response进行response.code判断,然后返回response)
 * @param control    控制选项
 */
export function request(method, proxyName, url, params, success, fail, option, filter, control) {

    if (success === null || typeof success !== "function") {
        console.error('请传入成功回调函数success()');
        return;
    }

    if (bd_utils.isEmpty(filter)) {
        filter = true;
    }

    /* 超时时间 */
    axios.defaults.timeout = CONSTANTS.HTTP.TIME.timeout;
    /* 数据签名 */
    let sign = handleAuthor(url, params, method);
    proxyName = hostMapper[proxyName];

    let requestData = {
        method: method,
        params: sign
    }

    if (!bd_utils.isEmpty(option)) {
        requestData = $.extend(requestData, option);
    }

    let obj = {enableTips: true};
    if (control === null || control === undefined) {
        control = obj;
    }

    axios(proxyName + url, requestData).then(response => {
        //http请求响应
        let errTips = '';
        if (!bd_utils.isEmpty(response)) {
            if (bd_utils.isFunction(filter)) {
                errTips = filter(response, success);
            } else {
                errTips = bd_response_filter.nullDataFilter(response, success);
            }
        } else {
            console.error(CONSTANTS.HTTP.TIPS.responseError, 'response为空');
        }
        //执行错误提示
        if (CONSTANTS.HTTP.ENABLE.tips && control.enableTips) {
            Tip.info(bd_utils.notNull(errTips, CONSTANTS.HTTP.TIPS.responseError));
        }
        //执行失败回调
        if (fail !== null && typeof fail === "function") {
            response.message = errTips;
            response.tips = errTips;
            fail(response);
        }
    }).catch(err => {
        //错误捕获
        if (err && err.code) {
            if (err.code === CONSTANTS.HTTP.CODE.success) {
                return;
            } else if (err.code === CONSTANTS.HTTP.CODE.timeout) {
                err.tips = CONSTANTS.HTTP.TIPS.timeout;
            } else if (err.code === CONSTANTS.HTTP.CODE.networkError) {
                err.tips = CONSTANTS.HTTP.TIPS.networkError;
            } else if (err.code === CONSTANTS.HTTP.CODE.arriveError) {
                err.tips = CONSTANTS.HTTP.TIPS.responseError;
            } else {
                err.tips = CONSTANTS.HTTP.TIPS.serverError;
            }
        } else {
            err.tips = CONSTANTS.HTTP.TIPS.clientError;
        }
        //执行错误提示
        if (CONSTANTS.HTTP.ENABLE.tips && control.enableTips) {
            Tip.info(err.tips);
        }

        //执行失败回调
        if (fail !== null && typeof fail === "function") {
            fail(err);
        }
        //错误打印
        console.error(err.tips + "\n" + err.message + '\n' + err.stack);
    })
}

/* 请求前拦截 */
axios.interceptors.request.use(config => {
    Tip.loading(0);
    console.log(config.url);
    return config;
}, err => {
    return Promise.reject(err)
});

/* 相应拦截 */
axios.interceptors.response.use(config => {
    Tip.close();
    console.log('request success');
    return config.data;
}, err => {
    Tip.close();
    console.error('request fail');
    if (err.message.includes('timeout') || err.message.includes('ERR_CONNECTION_TIMED_OUT')) {   // 判断请求异常信息中是否含有超时timeout字符串
        err.code = CONSTANTS.HTTP.CODE.timeout
    } else if (err.message.includes('Network Error')) {
        if (!navigator.onLine) {
            err.code = CONSTANTS.HTTP.CODE.networkError;
        } else {
            err.code = CONSTANTS.HTTP.CODE.arriveError;
        }
    }
    return Promise.reject(err);
});

/* 数据签名 */
function handleAuthor(url, data, method) {

    console.log(data)

    url = '/rest' + url;
    // TODO: 测试key，需要确认生产和测试的，然后在kmc-hostUrls文件里替换
    let apikey = 'icsapp';
    let apisecret = 'NPbv0msgxDBUMlax';
    // TODO: 判断生产还是测试，使用相应的key
    let authorData = {
        apikey: apikey,
        ts: new Date().getTime(),
    };
    let allData = $.extend(data, authorData);
    let paramStrings = [];
    for (let i in allData) {
        if (allData[i] !== undefined && allData[i] !== null && allData[i] !== '') {
            paramStrings.push(i.toString() + '=' + allData[i].toString());
        }
    }
    allData['sign'] = createSign(method.toUpperCase(), url, apisecret, paramStrings, null);
    return allData;
}

/**
 * 生成签名
 */
function createSign(method, servicePath, apiSecret, paramStrings, postbody) {
    let str = method + servicePath;
    paramStrings = paramStrings.sort();
    str = str + paramStrings.join("");
    str = str + apiSecret;
    str.toString();
    let urlEncodeStr = encodeURIComponent(str);
    return md5(urlEncodeStr);
}

/**
 * 当前时间戳加10分钟
 */
function curTimeAdd10Min() {
    let time = new Date();
    // let t = time.getTime();
    // time.setTime(t + 1000 * 60 * 10);
    return time.getTime();
}

