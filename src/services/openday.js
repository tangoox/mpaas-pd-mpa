import {request} from "../utils/bd_request";
import constants from "../utils/constants";
import bd_utils from "../utils/bd_utils";
import commonApi from "./common_api";

export default {

    product_list: commonApi.product_list,

    /**
     * 开放日
     * @param index     0:历史 1:未来
     * @param success   成功回调
     * @param fail      失败回调
     * @param params    url请求参数
     * @param body      json参数
     */
    findOpenTmpe: function (index, success, fail, params, body) {

        let addr = 'findBeforeOpenTmpe';
        if (index === 1) {
            addr = 'findAfterOpenTmpe';
        }

        request('post', '/api', constants.tgpt + '/product/' + addr, params,
            (response) => {
                if (bd_utils.isEmpty(response.data.list)) {
                    response.data.list = [];
                }
                success(response.data);
            }, fail, {
                data: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json;"
                }
            }
        );
    },


}
