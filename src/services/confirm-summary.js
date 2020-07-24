import commonApi from "./common_api";
import {request} from "../utils/bd_request";
import constants from "../utils/constants";

export default {
    product_list: commonApi.findProductName,

    /* 确认汇总 - 柱状图数据 */
    summaryBarData:function (params,success,fail) {
        request('post','/api',constants.tgpt + '/product/share/barList',null,function (result) {
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

    /* 确认汇总 - 历史份额详情*/
    confirmSummary:function (params,success,fail) {
        request('post','/api',constants.tgpt + '/product/share/list',null,function (result) {
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

    /* 确认汇总详情 */
    summaryDetails:function (params,success,fail) {
        request('post','/api',constants.tgpt + '/customer/share/dailyInfo',null,function (result) {
            success(result.data)
        },function (err) {
            if (fail !== null && typeof fail === "function") {fail(err);}
        },{
            data: JSON.stringify(params),
            headers: {"Content-Type": "application/json;"}
        })
    },

    /* 确认汇总流水—————募集户查询 */
    mjh_query:function (params,success,fail) {

        if (params.id === null || params.id === undefined){
            params.cpId = "6BA83843F9346DC3E053281C110A4F12"
        }

        request('post','/api',constants.tgpt + '/runquery/raiseRunQuery',null,function (result) {
            success(result.data)
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

    /* 确认汇总流水—————托管户查询  */
    tgh_query:function (params,success,fail) {
        if (params.id === null || params.id === undefined){
            params.cpId = "6BA83843F9346DC3E053281C110A4F12"
        }
        request('post','/api',constants.tgpt + '/runquery/hostRunQuery',null,function (result) {
            success(result.data)
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