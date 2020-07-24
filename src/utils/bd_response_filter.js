import bd_utils from "./bd_utils";
import CONSTANTS from "./constants";
import bd_exception from "./bd_exception";

export default {

    /**
     * http请求响应过滤器=>不拦截直接返回整个响应体
     * @param response http响应体
     * @param success  成功回调
     */
    noFilter: function (response, success) {
        //不进行过滤,直接返回整个response
        success(response);
        throw new bd_exception.bderror(CONSTANTS.HTTP.CODE.success, 'success');
    },

    /**
     * http请求默认响应过滤器=>无data响应过滤器
     * @param response http响应体
     * @param success  成功回调
     * @return {*}
     */
    nullDataFilter: function (response, success) {
        if (!bd_utils.isEmpty(response.code)) {
            if (CONSTANTS.HTTP.CODE.succesies.includes(parseInt(response.code))) {
                if (!bd_utils.isEmpty(response.data)) {
                    //成功的请求
                    success(response);
                    throw new bd_exception.bderror(CONSTANTS.HTTP.CODE.success, 'success');
                } else {
                    //没有data
                    console.error(CONSTANTS.HTTP.TIPS.errorCode, response);
                    return CONSTANTS.HTTP.TIPS.nodata;
                }
            } else {
                console.error(CONSTANTS.HTTP.TIPS.errorCode, response);
                if (response.message === '程序异常') {
                    response.message = '服务器异常';
                }
                return response.message;
            }
        } else {
            console.error(CONSTANTS.HTTP.TIPS.errorCode, response);
            return response.errmsg;
        }
    },

    /**
     * http请求响应过滤器=>不判断data是否为空
     * @param response
     * @param success
     * @return {*}
     */
    responseFilter: function (response, success) {
        if (!bd_utils.isEmpty(response.code)) {
            if (CONSTANTS.HTTP.CODE.succesies.includes(parseInt(response.code))) {
                //成功的请求
                success(response);
                throw new bd_exception.bderror(CONSTANTS.HTTP.CODE.success, 'success');
            } else {
                console.error(CONSTANTS.HTTP.TIPS.errorCode, response);
                if (response.message === '程序异常') {
                    response.message = '服务器异常';
                }
                return response.message;
            }
        } else {
            console.error(CONSTANTS.HTTP.TIPS.errorCode, response);
            return response.errmsg;
        }
    }

}
