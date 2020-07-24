import {EventEmitter} from 'events';
let Bus = new EventEmitter();

export default {
    /* 注册到事件总线中 */
    bd_addListener:function (name,event) {
        Bus.addListener(name,event);
    },

    /* 删除已注册的事件 */
    bd_remove_listener:function (name,event) {
        Bus.removeListener(name,event);
    },

    /* 调用已注册的事件 */
    bd_emit:function (name,data) {
        Bus.emit(name,data);
    }
}
