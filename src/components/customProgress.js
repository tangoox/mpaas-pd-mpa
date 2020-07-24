import React, {Component} from 'react';
import { Progress } from 'antd-mobile';
import './index.css';
/**
 *  此子组件为封装的进度条组件（样式选择为默认）
 *
 *  1、父组件需要引入此组件
 *  import CustomProgress from '../components/CustomProgress'
 *  2、父组件中添加值
 *  this.state = { progressValue: 50  }       //设置动态进度（值）
 *  3、父组件的值传递给此子组件
 *  <CustomProgress progressObject={this.state.progressObject} />
 *
 *  备注：1、position="normal"任意位置
 *       2、position="fixed"页面顶置
 * */
class CustomProgress extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="progress-container">
                <div className="show-info">
                    <div className="progress"><Progress percent={this.props.progressValue} position="normal" appearTransition/></div>
                    <div aria-hidden="true">{this.props.progressValue}%</div>
                </div>
            </div>
        )
    }
}

export default CustomProgress;