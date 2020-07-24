import {request} from '../utils/bd_request';
import constants from "../utils/constants";
import bd_utils from "../utils/bd_utils";

export default {
    /*通过手机号获取用户所有账户*/
    accountList: function (success, fail, body) {
        //获取用户信息
        bd_utils.getResearchUser().then(user => {
            if (!bd_utils.isEmpty(user)) {
                request('post', '/api', constants.insti + '/user/accounts/info', null, success, null,
                    {
                        data: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json;",
                            token: user.token
                        }
                    },null,{enableTips:false})
            }
        });
    },
    /*二次登录*/
    secondLogin: function (success, fail, body) {
        //获取用户信息
        bd_utils.getResearchUser().then(user => {
            if (!bd_utils.isEmpty(user)) {
                request('post', '/api', constants.insti + '/user/login/second', null, success, null,
                {
                    data: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json;",
                        token: user.token
                    }
                })
            }
        });
    },
    /* 产品下拉框 */
    product_list:function (params,success,fail,type) {
        if (bd_utils.isEmpty(params)){
            params = {pageSize:-1}
        }else{
            if (params.pageSize === undefined || params.pageSize === null){
                params.pageSize = -1;
            }
        }
        const {pageSize}=params
        const urlParam=pageSize?{pageSize}:null;
        bd_utils.getAsynUser(constants.KEYS.userId,constants.KEYS.user).then(data=>{
            if (data && data.users && data.users.thirdId){
                params.cpId = data.users.thirdId;
                request('post','/api',constants.tgpt + '/product/getProduct',urlParam,function (result) {
                    /* 转换成下拉框样式 */
                    if (result.data && result.data.list){
                        var list = [];
                        let productList = result.data.list;
                        for(var i=0;i<productList.length;i++){
                            let item = productList[i];
                            let obj = {
                                "label":item.productName,
                                "value":type ? item.productNo : item.id,
                                "des":item
                            }
                            list.push(obj);
                        }
                        success(list)
                    }

                },function (err) {

                },{
                    data: JSON.stringify(params),
                    headers: {
                        "Content-Type": "application/json;"
                    }
                })
            }
        });
    },
    /* 产品下拉框（包含母子产品） */
    findProductName:function (params,success,fail,type) {
        if (bd_utils.isEmpty(params)){
            params = {}
        }
        const {pageSize}=params
        const urlParam=pageSize?{pageSize}:null;
        request('post','/api',constants.tgpt + '/product/findProductName',urlParam,function (result) {
            /* 转换成下拉框样式 */
            if (result.data && result.data.list){
                var list = [];
                let productList = result.data.list;
                for(var i=0;i<productList.length;i++){
                    let item = productList[i];
                    let obj = {
                        "label":item.productName,
                        "value":type ? item.productNo : item.id,
                        "des":item
                    }
                    list.push(obj);
                }
                success(list)
            }

        },function (err) {

        },{
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    },
    /* 查询客户份额 */
    getCustomerShare:function(params,success,fail){
        request('post','/api',constants.tgpt + '/customer/share/lastList',null,function (res) {
            success(res.data)
        },function (err) {
        },{
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    },

    customerShareSearch(params,success,fail){
        request('post','/api',constants.tgpt + '/customer/share/search',null,function (res) {
           const customerShare = [];
            if(res.data){
                res.data.map(t =>{
                    customerShare.push({label:t.investorname, value:t.taaccountid,des:t})
                })
            }
            success(customerShare)
        },function (err) {
        },{
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    },

    customerShareInfo(params,success,fail){
        request('post','/api',constants.tgpt + '/customer/share/info',null,function (res) {
            success(res.data)
        },function (err) {
        },{
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json;"
            }
        })
    }
}
