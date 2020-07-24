import {request} from '../utils/bd_request';
import constants from "../utils/constants";
import commonApi from './common_api';
import tip from '../components/tip'

export default {

    product_list: commonApi.findProductName,

    /* 查询净值历史列表信息 */
    netWorthList:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/product/networth/list',null,function (result) {
            if (result.code === 200) {
                success(result.data)
            }
        },function (err) {
            if (fail !== null && typeof fail === "function") {
                fail(err);
            }
        },{
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    },

    /* 净值折线图查询 */
    netWorthView:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/product/networth/list/view',null,function (result) {
            if (result.code === 200) {
                success(result.data)
            }
        },function (err) {
            if (fail !== null && typeof fail === "function") {
                fail(err);
            }
        },{
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    },

}