export default {
    ADMIN: false,
    BaseHost: 'https://zs-test.csc108.com/rest',
    // BaseHost: '/api',
    resea: '/institution/resea',
    insti: '/institution/insti',
    tgpt: '/institution/tgpt',
    KEYS: {
        user: 'outsourceAuth',
        userId: 'outsourceUserId',
        systemCode: '9001',
        researchUser: 'researchAuth',
        researchUserId: 'researchUserId'
    },
    ENCRYPTED_FIELD: ['researchAuth', 'researchUserId'],
    CURRENCY:{
        productList:'productList'
    },
    LOG: {
        componentUpdate: {
            state: true,
            result: true
        }
    },
    HTTP: {
        ENABLE: {
            tips: true,
        },
        TIME: {
            timeout: 8000,
        },
        CODE: {
            success: 200,
            succesies: [1, 200, 203, 204],
            timeout: 666,
            networkError: -666,
            arriveError: 777,
        },
        TIPS: {
            nodata: '未找到数据',
            errorCode: 'Code不存在或不匹配成功Code',
            timeout: '请求超时',
            networkError: '网络连接不可用',
            responseError: '网络请求异常',
            serverError: '服务器异常',
            clientError: '程序异常'
        },
    },
    POINT: {
        EVENT: {
            class: "event-click",
            id: 'event-id',
            label: 'event-label',
            kv: 'event-kv'
        },
        PAGE: {
            start: 'PAGE_START',
            end: 'PAGE_END',
        }
    },
    HISTORY: {
        "HISTORY_HOT_ACTIVITY": 10,
        "HISTORY_SUBJECT": 20,
        "HISTORY_QUICK": 30,
        "HISTORY_ANALYSER": 40,
        "HISTORY_REPORT": 50,
        "HISTORY_PRODUCT": 60,
        "HISTORY_EXPIRED_TIME": 30
    },
    PAGE: {
        guess: '研究-猜你想看'
    },
    ROUTER: {
        search: 0,
        state: 1
    },
    FILTER: {
        noAuth: '403-未登录',
        noPage: '404-页面不存在,请检查跳转URL',
        noRole: '405-无权限',
        noRoleTips: '无权查看,请联系销售'
    },
    EVENTS: {
        VIEWS: {
        },
        LOGINSTATUS: {
            MSG: "login-status",
            IN: 'login',
            OUT: 'logout'
        }
    }
}
