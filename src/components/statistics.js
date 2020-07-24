import React, {Component} from "react";
import bd_utils from "../utils/bd_utils";
import KmcInteraction from "../utils/kmc/kmc-interaction";
import constants from "../utils/constants";

/**
 * 页面统计组件
 */
export default class Statistics extends Component {

    constructor(props, pageName, inject) {
        super(props);
        //页面名称
        this.pageName = bd_utils.isEmpty(pageName) ? '' : inject;
        //默认不注入点击事件
        this.inject = bd_utils.isEmpty(inject) ? true : inject;
    }

    componentDidMount() {
        //页面统计埋点写入
        if (!bd_utils.isEmpty(this.pageName)) {
            KmcInteraction.onAgentPageMpaas(this.pageName, constants.POINT.PAGE.start);
        }
    }

    componentWillUnmount() {
        //页面统计埋点写入
        if (!bd_utils.isEmpty(this.pageName)) {
            KmcInteraction.onAgentPageMpaas(this.pageName, constants.POINT.PAGE.end);
        }
    }


    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.inject) {
            //todo:页面点击事件统计逻辑注入
            let elements = document.getElementsByClassName("event-click");
            if (elements.length === 0) {
                return;
            }
            for (let i = 0; i < elements.length; i++) {
                let eventId = elements[i].getAttribute(constants.POINT.EVENT.id);
                let eventLabel = elements[i].getAttribute(constants.POINT.EVENT.label);
                let eventKv = elements[i].getAttribute(constants.POINT.EVENT.kv);
                let temp = elements[i].onclick;
                elements[i].onclick = function () {
                    if (!bd_utils.isEmpty(eventId) && !bd_utils.isEmpty(eventLabel)) {
                        //上报埋点信息
                        console.log('埋点信息上报')
                        console.log("eventId", eventId);
                        console.log("eventLabel", eventLabel);
                        console.log("eventKv", eventKv);
                        KmcInteraction.onAgentEvent(eventId, eventLabel, eventKv);
                    }
                };
            }
            //注入完成
            this.inject = false;
        }
    }
}
