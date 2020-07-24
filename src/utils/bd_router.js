import Qs from "qs";
import bd_utils from "./bd_utils";
import Tip from "../components/tip";
import constants from "./constants";
// import routerMap from "../routerMap";
import bd_exception from "./bd_exception";

export default {

    /**
     *  跳转路由，地址不改变，参数驱动页面
     * @param url           页面地址
     * @param history       history
     * @param option        可选参数
     */
    push: async function (history, url, option) {
        console.log("option", option);
        if (bd_utils.isEmpty(history)) {
            console.error("history is undefined")
            return;
        }
        if (bd_utils.isEmpty(url)) {
            console.error("url is undefined")
            return;
        }
        let obj = {};
        if (option === null || option === undefined) {
            option = obj;
        }

        if (!constants.ADMIN) {
            //登录拦截
            if (option.authFilter === undefined || option.authFilter === null) {
                console.log("use defaultAuthFilter")
                option.authFilter = async () => {
                    await this.defaultAuthFilter(history, url);
                }
            } else {
                console.log("use option authFilter")
            }

            //执行权限拦截逻辑
            // if (option.roleFilter === undefined || option.roleFilter === null) {
            //     console.log("use defaultRoleFilter")
            //     option.roleFilter = async () => {
            //         await this.defaultRoleFilter(url)
            //     };
            // } else {
            //     console.log("use option roleFilter")
            // }

            //执行拦截登陆逻辑
            await option.authFilter(history, url);
            //执行权限拦截逻辑
            // await option.roleFilter(url);
        }

        //通过权限拦截,选择跳转方式
        this.realPush(history, option, url);
    },

    /**
     * 实际跳转
     * @param history
     * @param option
     * @param url
     */
    realPush: function (history, option, url) {
        //通过权限拦截,选择跳转方式
        if (option.type !== null && option.type === constants.ROUTER.state) {
            history.push({
                pathname: url,
                state: option.data
            });
        } else {
            history.push({
                pathname: url,
                search: bd_utils.isEmpty(option.data) ? '' : Qs.stringify(option.data)
            })
        }
    },

    /**
     * 登录过滤器
     */
    // defaultAuthFilter: async function (history, url) {
    //     console.log("auth-url", url);
    //     let page = routerMap.pagesMap[url];
    //     if (bd_utils.isEmpty(page)) {
    //         //异常，地址在路由中不存在
    //         Tip.info('页面404');
    //         throw new bd_exception.bderror(404, constants.FILTER.noPage)
    //     }

    //     // console.error(routerMap.pagesMap[url]);
    //     if (!bd_utils.isEmpty(routerMap.pagesMap[url].auth)) {
    //         //进行登录拦截
    //         let user = await bd_utils.getUser();
    //         if (bd_utils.isEmpty(user)) {
    //             //去登录界面
    //             await this.push(history, '/login')
    //             throw new bd_exception.bderror(403, constants.FILTER.noAuth);
    //         }
    //     }
    // },

    /**
     * 权限过滤器
     */
    // defaultRoleFilter: async function (url) {
    //     console.log("router-url", url);
    //     let page = routerMap.pagesMap[url];
    //     if (bd_utils.isEmpty(page)) {
    //         //异常，地址在路由中不存在
    //         Tip.info(constants.FILTER.noPage);
    //         throw new bd_exception.bderror(404, constants.FILTER.noPage)
    //     }

    //     let needRole = !bd_utils.isEmpty(page.role);

    //     let hasRole = false;
    //     if (needRole) {
    //         //需要权限拦截
    //         let user = await bd_utils.getResearchUser();
    //         if (!bd_utils.isEmpty(user)) {
    //             //权限拦截
    //             for (let i = 0; i < user.menus.length; i++) {
    //                 if (url === user.menus[i].menuUrl) {
    //                     //有权限
    //                     hasRole = true;
    //                     break;
    //                 }
    //             }
    //         } else {
    //             hasRole = true;
    //         }
    //         if (!hasRole) {
    //             Tip.info(constants.FILTER.noRoleTips);
    //             throw new bd_exception.bderror(405, constants.FILTER.noRole)
    //         }
    //     }
    // },

    /* 跳转另外的应用 */
    gotoApp: function (id) {
        if (id === null || id === undefined) {
            return;
        }
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('startApp', {
                appId: id,
                param: {
                    url: '/index.html',
                    st: 'NO',
                    pd: 'NO',
                    bb: 'auto'
                }
            }, function (result) {
                Tip.info(result ? result.code : "打开失败");
            });
        }
    },
    /*退出当前应用*/
    exiTApp: function () {
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('exitApp');
        }
    }
}
