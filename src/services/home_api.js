import {request} from "../utils/bd_request";
import commonApi from "./common_api";
import constants from "../utils/constants";
import bd_utils from "../utils/bd_utils";
export default {
    product_list: commonApi.findProductName,
    productList_query:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/product/getAllProduct',null,function (result) {
            success(result.data)
            return result.data
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
    productTotal:function(params,success,fail){
        request('post','/api',constants.tgpt + '/product/productCount',params,function (result) {
            success(result.data)
            return result.data
        },function (err) {
            if (fail !== null && typeof fail === "function") {
                fail(err);
            }
        },{
            // data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    },
    getProduct_calendar:function(params,success,fail){
        request('post','/api',constants.tgpt + '/product/calendar',null,function (result) {
            success(result.data)
            return result.data
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
    // 新通知
    findNotice:function(params,success,fail){
        request('post','/api',constants.tgpt + '/notice/findNotice',null,function (result) {
            success(result.data)
            return result.data
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
    // 新业务
    findBusinessList:function(params,success,fail){
        request('post','/api',constants.tgpt + '/notice/business/list',null,function (result) {
            success(result.data)
            return result.data
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
    }
}