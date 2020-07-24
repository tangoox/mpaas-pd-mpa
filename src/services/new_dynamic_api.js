import {request} from '../utils/bd_request';
import constants from "../utils/constants";

export default {

    /* 新动态接口 */
    new_notice_query:function (pageNo,keyWord,success,fail) {

        var params = {
            pageNo: pageNo,
            pageSize : 10,
            cpId: "allCompany",
            str: keyWord
        }

        request('post','/api',constants.tgpt + '/notice/findNotice',null,function (result) {
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
        });
    },
    /* 微课堂接口 */
    new_classes_query:function (pageNo,keyWord,success,fail) {
        var params = {
            pageNo: pageNo,
            pageSize : 10,
            str: keyWord
        }
        request('post','/api',constants.tgpt + '/notice/classroom',null,function (result) {
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
    /* 新业务接口 */
    new_business_query:function (pageNo,keyword,success,fail) {
        var params = {
            pageNo: pageNo,
            pageSize : 10,
            str: keyword
        }
        request('post','/api',constants.tgpt + '/notice/business/list',null,function (result) {
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
        });
    }
}