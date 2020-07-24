import {request} from '../utils/bd_request';
import constants from "../utils/constants";
import commonApi from './common_api';

export default {

    product_list:commonApi.product_list,

    /* 税费查询 */
    tax_query:function (params,success,fail) {

        request('post','/api',constants.tgpt + '/taxfee/getproductTaxfee',null,function (result) {
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
