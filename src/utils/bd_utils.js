import Qs from "qs";
import md5 from "js-md5"
import bd_storage from "./bd_storage";
import CONSTANTS from "./constants";
import Tip from "../components/tip";
import bd_router from "./bd_router";
import constants from "./constants";
import bd_exception from "./bd_exception";
import $ from "jquery";

export default {

    /**
     * 服务器端时间格式化
     * @param timeStr 服务器端的时间字符串
     * @param format  规格
     * @return {string}
     */
    dateFormat: function (timeStr, format = 'YYYY-mm-dd HH:MM') {
        let str = '1970/01/01 00:00:00';
        if (!this.isEmpty(timeStr)) {
            str = timeStr.toString().replace(/-/g, "/").replace(".000+0000", "").replace("T", " ").replace(".0", "");
        }
        if (!str) {
            return
        }
        let date = new Date(str);
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        let ret;
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(format);
            if (ret) {
                format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return format;
    },
    // 浮点数取几位小数
    // @params num 要转换的数字
    // @params len 保留的长度
    FloatLengthFormat: function (num, len) {
        const templen = Math.pow(10, parseInt(len));
        const tempNum =Math.round(num * templen)/templen;
        return tempNum;
        // let numStr = num.toString();
        // return parseFloat(numStr.substr(0, numStr.indexOf(".") + len + 1))
    },
    // js 精确乘法
    accMul: function (arg1, arg2) {
        var m = 0;
        m += this.deal(arg1);
        m += this.deal(arg2);
        var r1 = Number(arg1.toString().replace(".", ""));
        var r2 = Number(arg2.toString().replace(".", ""));
        return (r1 * r2) / Math.pow(10, m)
    },
    /**
     * 求小数点后的数据长度
     */
    deal: function (arg) {
        var t = 0;
        try {
            t = arg.toString().split(".")[1].length
        } catch (e) { }
        return t;
    },
    /**
     * 非空判断-无法判断function
     * @param params
     * @returns {boolean}
     */
    isEmpty: function (params) {
        return params === null || params === undefined || params === "undefined" || params.length === 0;
        // || Object.keys(params).length === 0;
    },

    /**
     * 判断是不是一个方法
     * @param obj
     * @return {boolean}
     */
    isFunction: function (obj) {
        return obj !== null && obj !== 'undefined' && typeof obj === 'function';
    },

    /**
     * 非空拦截
     * @param param 拦截参数
     * @param defaultValue 空值默认值
     */
    notNull: function (param, defaultValue) {
        return param ? param : (defaultValue ? defaultValue : '');
    },

    /**
     * 检查分页参数
     * @param params
     * @param size
     * @returns {{pageNo: number, pageSize: number}}
     */
    checkPageParams: function (params, size) {

        let pageNo = 1;
        let pageSize = 5;

        if (this.isEmpty(size)) {
            size = pageSize;
        }

        if (this.isEmpty(params)) {
            params = {
                pageNo: pageNo,
                pageSize: size
            };
        } else {
            if (this.isEmpty(params.pageNo)) {
                params.pageNo = pageNo;
                params.pageSize = size;
            }
        }

        return params;
    },

    timeFormat: function (timeStr, isNeedTime = true) {
        if (!timeStr) {
            return timeStr
        }
        if (!timeStr.includes("T")) {
            return timeStr
        }
        let arr = timeStr.split("T")
        if (isNeedTime) {
            return (arr[0] + " " + arr[1].substring(0, 5))
        } else {
            return (arr[0])
        }
    },

    /**
     * 取出jsonarraystring中的指定key值
     * @param obj
     * @param key
     * @param jsonKey
     * @returns {null|*}
     */
    fetchJsonArrayValue: function (obj, key, jsonKey) {
        try {
            let jsonValue = obj[key];
            if (!this.isEmpty(jsonValue)) {
                let jsonObj = JSON.parse(jsonValue);

                if (this.isEmpty(jsonKey)) {
                    return jsonObj[key][0];
                } else {
                    return jsonObj[jsonKey][0];
                }
            }
            return null;
        } catch (e) {
            console.error('json转换异常');
            return null;
        }
    },

    /**
     * 取出标签
     */
    fetchLabels: function (str) {
        let labels = [];
        if (!this.isEmpty(str)) {
            labels = str.split("/");
        }
        return labels;
    },

    /**
     * 取出search url中的参数
     * @param location
     * @returns {any}
     */
    fetchSearchParams: function (location) {
        if (this.isEmpty(location)) {
            console.error("location is undefined")
            return;
        }

        let searchStr = location.search;
        return this.isEmpty(searchStr) ? {} : Qs.parse(searchStr.split('?')[1]);
    },

    /**
     * 登陆密码加密
     * @param pwd
     * @returns {*}
     */
    encryptionPwd: function (pwd) {
        return md5(pwd + '_csc', 32)
    },
    md5Pwd: function (pwd) {
        return md5(pwd, 32).toUpperCase()
    },

    /**
     * 异步获取用户信息
     * @returns {string|*}
     */
    getAsynUser: function (userId, key) {

        if (window.AlipayJSBridge) {
            return bd_storage.get(userId).then(uid => {
                if (this.isEmpty(uid)) {
                    return new Promise((resolve) => {
                        resolve(null);
                    });
                }
                return this.getEncUser(uid, key).then((user) => {
                    if ($.isEmptyObject(user) || $.isEmptyObject(user.users)) {
                        user = null;
                    }
                    return user;
                })
            });
        } else {
            return bd_storage.get(key).then(user => {
                return new Promise((resolve) => {
                    if ($.isEmptyObject(user) || $.isEmptyObject(user.users)) {
                        user = null;
                    }
                    resolve(user);
                });
            })
        }
    },

    /**
     * 获取机构用户信息
     * @param history
     * @return {*}
     */
    getResearchUser(history) {
        return this.getAsynUser(CONSTANTS.KEYS.researchUserId, CONSTANTS.KEYS.researchUser).then(user => {
            if (this.isEmpty(user) && !this.isEmpty(history)) {
                //todo:关闭托管外包
                Tip.warning('获取机构账户信息失败', '', () => {
                    bd_router.exiTApp();
                })
                throw new bd_exception.bderror(403, constants.FILTER.noAuth);
            }
            return user;
        });
    },

    /**
     * 获取托管外包用户
     * @param history
     * @return {*}
     */
    getUser(history) {
        return this.getAsynUser(CONSTANTS.KEYS.userId, CONSTANTS.KEYS.user).then(user => {
            if (this.isEmpty(user) && !this.isEmpty(history)) {
                //没有用户信息,去登陆界面
                bd_router.push(history, '/login');
                throw new bd_exception.bderror(403, constants.FILTER.noAuth);
            }
            return user;
        });
    },

    /**
     * 获取加密用户信息
     * @param userId 用户id
     * @param key
     */
    getEncUser: function (userId, key) {
        if (window.AlipayJSBridge) {
            return new Promise(function (resolve, reject) {
                window.AlipayJSBridge && window.AlipayJSBridge.call('getUserDataEnc', {
                    userId: userId,
                    key: key
                },
                    function (result) {
                        let user = null;
                        if (!$.isEmptyObject(result) && !$.isEmptyObject(result.data)) {
                            user = bd_storage.objectification(null, result.data);
                        }
                        resolve(user);
                    });
            });
        }
    },

    /**
     * 删除加密用户信息
     * @param userId 用户id
     * @param callBack
     */
    removeUser: function (userId, callBack) {
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('removeUserDataEnc', {
                userId: userId,
                key: CONSTANTS.KEYS.user
            },
                function (result) {
                    if (callBack) {
                        callBack(result);
                    }
                });
        }
    },

    /**
     * 存储加密用户信息
     * @param userId 用户id
     * @param key
     * @param params 用户信息
     * @param both
     */
    setUser: async function (userId, key, params, both = false) {

        let hasWindowJSBridge = false;
        if (window.AlipayJSBridge) {
            hasWindowJSBridge = true;
            window.AlipayJSBridge && window.AlipayJSBridge.call(
                'setUserDataEnc', {
                userId: userId,
                key: key,
                value: params
            }, function (result) {
                // alert(JSON.stringify(result));
                console.log('setUser result:', result);
            });
        }

        if (!hasWindowJSBridge || both) {
            bd_storage.set(key, params);
        }
    },

    /**
     * 获取用户机构id
     * @param user
     * @return {*}
     */
    getCPID: function (user) {
        return user.users.thirdId ? user.users.thirdId : null;
    },

    /**
     *
     * @param menus     菜单列表
     * @param menuName  菜单名称
     * @param history
     * @return {boolean}
     */
    permiMenuname: function (menus, menuName, history) {
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].menuName === menuName) {
                return true;
            }
        }
        if (history) {
            Tip.info(constants.FILTER.noRoleTips);
            throw new bd_exception.bderror(405, constants.FILTER.noRole);
        }
        return false;
    },

    /**
     * 界面更新逻辑封装与日志打印
     * @param Clazz            界面类名
     * @param nextProps        nextProps
     * @param nextState        nextState
     * @param currentState     this.state
     * @returns {boolean}
     */
    shouldComponentUpdate: function (Clazz, nextProps, nextState, currentState) {
        let enableUpdate = (currentState !== nextState);
        if (CONSTANTS.LOG.componentUpdate.state) {
            console.log(Clazz, "nextState", nextState);
            console.log(Clazz, "this.state", currentState);
        }
        if (CONSTANTS.LOG.componentUpdate.result) {
            console.log(Clazz, "enableUpdate", enableUpdate);
        }
        return enableUpdate;
    },

    /**
     * 预留本地缓存用户浏览历史记录接口
     * 当用户进入活动详情，专题详情，速评详情，分析师详情，研报详情，特色产品详情页面上调用。
     * 分类前端暂定分类key：
     * 10---活动详情
     * 20---专题详情
     * 30---速评详情
     * 40---分析师详情
     * 50---研报详情
     * 60---特色产品详情
     * 参数说明：anonymous---用户，categoryCode---分类，targetId---详情id
     * {time}~{userId}~{categoryCode}~{targetId},{time}~{userId}~{categoryCode}~{targetId},...
     *
     * browser_histories_[anonymous] = "2020-04-29 16:27:29~[anonymous]~研报~21,2020-04-29 16:31:16~[anonymous]~研报~21,2020-04-29 16:49:31~[anonymous]~专题~542233"
     */
    set: function (categoryCode, targetInfo) {
        let currentIndex = bd_storage.get("currentIndex", true);
        let index = currentIndex ? parseInt(currentIndex) + 1 : 0;
        let earliests = bd_storage.get("BrowserHistoryEarliest", true);
        earliests = earliests ? earliests : [];
        const today = new Date();
        const time = this.getCurrentTime(today);
        targetInfo.index = index;
        const record = { id: index, time: time, categoryCode: categoryCode, extra: targetInfo };
        bd_storage.set("BrowserHistoryRecord_" + index + "_" + categoryCode, record, true);
        const o = {
            id: index,
            category: categoryCode,
            expiredTime: this.getTimeByDay(today, CONSTANTS.HISTORY.HISTORY_EXPIRED_TIME)
        };
        earliests.push(o);
        bd_storage.set("BrowserHistoryEarliest", earliests, true);
        bd_storage.set("currentIndex", index, true);
    },

    /*根据过期时间删除过期的浏览记录*/
    removeByIds: function () {
        const currentTime = new Date().getTime();
        const expiredRecords = [];
        const earliests = bd_storage.get("BrowserHistoryEarliest", true);
        if (earliests) {
            earliests.map(o => {
                if (currentTime >= o.expiredTime) {
                    console.log("expired:", o);
                    expiredRecords.push(o)
                }
            });

            expiredRecords.map(o => {
                let index = earliests.findIndex(t => t.id === o.id)
                if (index !== -1) {
                    earliests.splice(index, 1);
                    bd_storage.remove("BrowserHistoryRecord_" + o.id + "_" + o.category)
                }
            });
            bd_storage.set("BrowserHistoryEarliest", earliests, true);
        }
    },

    getMyBsData: function (pageSize, category, id) {
        const arr = [];
        const records = [];
        const earliests = bd_storage.get("BrowserHistoryEarliest", true);
        if (!earliests) {
            return records;
        }
        earliests.sort().reverse();
        if (id === null || id === undefined || id === 'undefined') {
            earliests.map(item => {
                if (arr.length >= pageSize) {
                    return
                }
                if (item.category === category) {
                    arr.push(item)
                }
            });
            arr.map(item => {
                const record = bd_storage.get("BrowserHistoryRecord_" + item.id + "_" + item.category, true);
                if (record) {
                    records.push(record.extra)
                }
            });
        } else {
            earliests.map(o => {
                if (arr.length >= pageSize) {
                    return
                }
                if (o.id < id && o.category === category) {
                    arr.push(o)
                }
            });
            arr.map(item => {
                const record = bd_storage.get("BrowserHistoryRecord_" + item.id + "_" + item.category, true);
                if (record) {
                    records.push(record.extra)
                }
            });
        }
        console.log(records);
        return records;
    },
    /*
       num 获取当天多少天后的日期
       */
    getTimeByDay: function (today, num) {
        const nextTime = new Date(today.getTime() + 60 * 60 * 1000 * 24 * num).getTime();
        //const nextTime = new Date(today.getTime() + 2 * 60 * 1000).getTime();
        return nextTime

    },
    formatTime: function (time) {
        if (time) {
            return new Date(time).toISOString().split('T')[0];
        }
        return ''
    },

    getCurrentTime: function (date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s;
    },

    test: function () {
        if (!window.localStorage) {
            console.log('当前浏览器不支持localStorage!')
        }
        let test = '0123456789';
        let add = function (num) {
            num += num;
            if (num.length === 10240) {
                test = num;
                return;
            }
            add(num);
        }
        add(test);
        let sum = test;
        let show = setInterval(function () {
            sum += test;
            try {
                window.localStorage.removeItem('test');
                window.localStorage.setItem('test', sum);
                console.log(sum.length / 1024 + 'KB');
            } catch (e) {
                alert(sum.length / 1024 + 'KB超出最大限制');
                clearInterval(show);
            }
        }, 0.1)
    },

    /* 判断是否是图片 */
    judgeIsHeadPhoto(portrait) {
        const reg = RegExp(/.png/);
        if (portrait.match(reg)) {
            return true
        }
        return false
    },
    /*
 * formatMoney(s,type)
 * 功能：金额按千位逗号分割
 * 参数：s，需要格式化的金额数值.
 * 参数：type,判断格式化后的金额是否需要小数位.
 * 返回：返回格式化后的数值字符串.
 */
    formatMoney: function (s, type) {
        if (/[^0-9\.]/.test(s))
            return "0";
        if (s == null || s == "")
            return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        s = s.replace(/,(\d\d)$/, "");
        if (type == 0) {// 不带小数位(默认是有小数位)
            var a = s.split(".");
            if (a[1] == "00") {
                s = a[0];
            }
        }
        return s;
    },
    /*  通过天数计算开始时间 */
    calculateTime: function (days) {
        if (days !== null && days !== undefined) {
            var format = "YYYY-mm-dd";
            let endTime = new Date();
            var startTime = endTime - days * 1000 * 60 * 60 * 24;
            var date = new Date(startTime);
            const opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            let ret;
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(format);
                if (ret) {
                    format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                }
            }
            return format;
        } else {
            return "1970-01-01";
        }
    },
    /* 获取本周起始时间 */
    CurrentWeekStartEndTime: function (callback) {
        // 按周日为一周的最后一天计算
        var date = new Date();
        var today = date.getDay()
        var stepSunDay = -today + 1;
        // 如果今天是周日
        if (today === 0) {
            stepSunDay = -7;
        }
        // 周一距离今天的天数（负数表示）
        var stepMonday = 7 - today;
        var time = date.getTime();
        var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
        var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
        return callback(monday, sunday) && callback;
    },
    /*判断是否有服务权限*/
    isService(code) {
        //获取用户信息
        this.getResearchUser().then(user => {
            if (this.isEmpty(user)) {
                return false
            }
            let menusData = user.menus;
            if (code) {
                for (let i = 0; i < menusData.length; i++) {
                    if (menusData[i].menuCode === code) {
                        return true;
                    }
                }
            }
            return false;
        });
    },
    /*金额千分位加逗号*/
    amountFormat(num) {
        if (this.isEmpty(num)) return 0;
        let c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        return c;
    },
    // 邮箱解析
    analysisEmaile(str){
        if(this.isEmpty(str)||typeof str !== "string")return [];
        const resultEmaile=str.split(",");
        return resultEmaile;
    }
}


