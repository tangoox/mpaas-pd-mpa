import {request} from "../utils/bd_request";
import constants from "../utils/constants";
import bd_utils from "../utils/bd_utils";
export default {
    product_basic:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/product/findProduct',params,function (result) {
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
    product_email:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/product/getEmail',params,function (result) {
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
    product_account:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/product/getAccount',params,function (result) {
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
}