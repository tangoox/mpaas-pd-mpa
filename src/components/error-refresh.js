import React,{Component} from "react";
import "../css/error-refresh.less";

export default class ErrorRefresh extends Component {
    render() {
        return (
            <div className='errorRefresh' onClick={this.props.callBack}>
                <div className='loadButton'>{this.props.message ? this.props.message : "网络异常，点击屏幕重新加载"}</div>
            </div>
        )
    }
}
