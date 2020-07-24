import {Toast, Modal} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '../css/tip.less'

const alert = Modal.alert;

const Tip = {
    info: function info(content = "提示内容", duration = 2) {
        Toast.info(content, duration, null, true)
    },
    success: function success(content = "success", duration = 2) {
        Toast.success(content, duration, null, true)
    },
    fail: function fail(content = "失败", duration = 2) {
        Toast.fail(content, duration, null, true)
    },
    loading: function (duration = 2) {
        Toast.loading("加载中...", duration, null, true)
    },
    close() {
        Toast.hide()
    },
    model(tittle = "确定不再关注？", message = "", sureCallBack, cancelCallBack) {
        alert(tittle, message, [
            {
                text: '取消',
                onPress: () => typeof cancelCallBack === 'function' ? cancelCallBack() : ''
            },
            {text: '确定', onPress: () => typeof sureCallBack === 'function' ? sureCallBack() : ''},
        ])
    },
    warning(tittle = "", message = "", sureCallBack) {
        alert(tittle, message, [
            {text: '确定', onPress: () => typeof sureCallBack === 'function' ? sureCallBack() : ''},
        ])
    }
}

export default Tip;


