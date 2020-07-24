const KmcEnv = {
    platform: {
        "isPhone": true,
        "isAndroid": true,
        "type": "PC",
        "isBrower": true,
        "isWeixin": false
    },
    setPlatformInfo: function () {
    },
    //判断浏览器
    getBrowserType: function () {
        console.log("执行getBrowerType");
        this.platform['type'] = "PC";
        this.platform['isPhone'] = false;
        let ua = navigator.userAgent.toLowerCase();
        console.log("ua:" + ua);
        if (ua.indexOf('android') > -1) {
            this.platform['type'] = "Android";
            this.platform['isAndroid'] = true;
            this.platform['isPhone'] = true;
            this.platform['isBrower'] = false;
        } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
            this.platform['type'] = "iOS";
            this.platform['isAndroid'] = false;
            this.platform['isPhone'] = true;
            this.platform['isBrower'] = false;
        }
        if (this.platform["isWeixin"]) {
            this.platform['isPhone'] = false;
        }
        // if(ua.indexOf('safari')> -1 || ua.indexOf('chrome') >-1){
        //     this.platform['isBrower'] = true;
        // }
        // console.log("isBrower:"+this.platform['isBrower']);
        return this.platform['type'];
    },
};
KmcEnv.getBrowserType();
export default KmcEnv;
