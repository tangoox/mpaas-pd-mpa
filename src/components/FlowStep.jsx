import React, {Component} from 'react'
import {Steps} from 'antd-mobile';
import './style/FlowStep.less'

const Step = Steps.Step;

class FlowSteps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 2
        }
    }

    render() {
        return (
            <div>
                <div className='flowSteps'>
                    <div className='startFlow'>
                        <div className="statusText">准入</div>
                        <div className="statusText">合同签署</div>
                        <div className="statusText">募集</div>
                        <div className="statusText">成立</div>
                        <div className="statusText">备案</div>
                    </div>
                    <div className='step'>
                        <div className='step-container'>
                            <ul className='topUl'>
                                <li className={this.state.status >= 1 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 1 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 2 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 2 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 3 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 3 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 4 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 4 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 5 ? "isActive" : ""}></li>
                            </ul>
                            <div className='placeOlder'></div>
                            <ul className='bottomUl'>
                                <li className={this.state.status >= 9 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 8 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 8 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 7 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 7 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 6 ? "isActive" : ""}></li>
                                <li className={this.state.status >= 6 ? "isActive" : ""}></li>
                            </ul>
                        </div>
                        <div className={`roundBorder  ${this.state.status >= 5 ? "isActiveBorder" : ""}`}></div>
                    </div>
                    <div className='endFlow'>
                        <div className="statusText">清盘</div>
                        <div className="statusText">产品运营</div>
                        <div className="statusText">三方挂接</div>
                        <div className="statusText">股东卡开立</div>
                    </div>
                </div>
                <section className='flow'>
                    <div className='flowTitle'> 详细流程</div>
                    <Steps current={1}>
                        <Step title="2020-05-09" icon={<div className='stepIcon'></div>} description="准入审核"/>
                        <Step title="2020-05-10" icon={<div className='stepIcon'></div>} description="个人资料修改"/>
                        <Step title="2020-05-11" icon={<div className='stepIcon'></div>} description="安全密码修改"/>
                        <Step title="2020-05-12" icon={<div className='stepIcon'></div>} description="股东账户加挂"/>
                        <Step title="2020-05-13" icon={<div className='stepIcon'></div>} description="准入完成"/>
                    </Steps>
                </section>
            </div>
        );
    }
}


export default FlowSteps;