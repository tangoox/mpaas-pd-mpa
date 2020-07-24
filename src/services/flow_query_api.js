import {request} from '../utils/bd_request';
import constants from "../utils/constants";
import commonApi from './common_api';
import bd_utils from "../utils/bd_utils";

export default {

    product_list:commonApi.product_list,

    /* 募集户查询 */
    mjh_query:function (params,success,fail) {
        bd_utils.getAsynUser(constants.KEYS.userId,constants.KEYS.user).then(data=>{
            if (data && data.users){
                if (params.id === null || params.id === undefined){
                    params.cpId = data.users.thirdId ? data.users.thirdId : null;
                }
                request('post','/api',constants.tgpt + '/runquery/raiseRunQuery',{pageNo:1,pageSize:-1},function (result) {
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
        });
    },

    /* 托管户查询  */
    tgh_query:function (params,success,fail) {
        bd_utils.getAsynUser(constants.KEYS.userId,constants.KEYS.user).then(data=>{
            if (data && data.users){
                if (params.id === null || params.id === undefined){
                    params.cpId = data.users.thirdId ? data.users.thirdId : null;
                }
                request('post','/api',constants.tgpt + '/runquery/hostRunQuery',{pageNo:1,pageSize:-1},function (result) {
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
        });
    }
}
