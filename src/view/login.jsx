import React, {Component} from 'react';
import {Button, Checkbox, InputItem} from 'antd-mobile';
import Tip from '../components/tip'

import '../css/login.less'
import INavBar from "../components/i-navbar";
import bd_utils from "../utils/bd_utils";
import Api from "../services/common_api";
import bd_storage from "../utils/bd_storage";
import CONSTANTS from "../utils/constants";
import bd_router from "../utils/bd_router";

const CheckboxItem = Checkbox.CheckboxItem;

export default class Login extends Component {
    render() {
        return (
            <section className="Auth_Comm">
                <INavBar class={`inavbar bgnavbar linenavbar`} navlabel='登录' leftIcons={[{
                    icon: 'leftback whtback',
                    label: '',
                    event: () => this.props.history.goBack()
                }]}/>
                <LoginForm history={this.props.history}/>
            </section>
        );
    }
}

class LoginForm extends Component { /*top navbar*/

    constructor(props) {
        super(props);
        this.accountChange = this.accountChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.accountErrorClick = this.accountErrorClick.bind(this);
        this.passwordErrorClick = this.passwordErrorClick.bind(this);
        this.agreementChange = this.agreementChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.state = {
            account: '',
            password: '',
            accountError: false,
            passwordError: false,
            enableSubmit: false,
            agreement: false
        }
    }

    //输入账号赋值
    accountChange(value) {
        if (value.replace(/\s/g, '').length < 1) {
            this.setState({
                accountError: true
            });
        } else {
            this.setState({
                accountError: false
            });
        }
        this.setState({
            account: value,
        });
    }

    //输入密码赋值
    passwordChange(value) {
        if (value.replace(/\s/g, '').length < 1) {
            this.setState({
                passwordError: true
            });
        } else {
            this.setState({
                passwordError: false
            });
        }
        this.setState({
            password: value,
        });
    }

    //免责声明
    agreementChange() {
        this.state.agreement = !this.state.agreement;
        this.state.enableSubmit = this.state.agreement;
        this.setState({
            enableSubmit: this.state.enableSubmit
        })
    }

    //账号错误提示
    accountErrorClick() {
        if (this.state.accountError) {
            Tip.info('账号不能为空');
        }
    }

    //密码错误提示
    passwordErrorClick() {
        if (this.state.passwordError) {
            Tip.info('密码不能为空');
        }
    }

    //执行登陆请求
    doLogin() {
        if (!bd_utils.isEmpty(this.state.account) && !bd_utils.isEmpty(this.state.password)){
            Api.login((response) => {
                console.log(response)
                bd_storage.set(CONSTANTS.KEYS.user, response.data.profession[0], true);
                // this.props.history.goBack();
                this.props.history.go(0 - 1);
            }, null, {
                accountName: this.state.account.replace(/\s+/g,''),
                accountPassword: bd_utils.encryptionPwd(this.state.password),
                systemCode: CONSTANTS.KEYS.systemCode
            });
        } else {
            Tip.info('账号或密码不能为空')
        }
    }

    render() {
        return (
            <section className={`LoginForm ibody`}>
                <section className={`logo`}/>
                <section className={`authForm`}>
                    <form>
                        <section className={`form_item`}>
                            <InputItem
                                type="text"
                                maxLength={16}
                                placeholder="请输入账号"
                                clear
                                onErrorClick={this.accountErrorClick}
                                error={this.state.accountError}
                                value={this.state.account}
                                onChange={this.accountChange}
                            />
                        </section>
                        <section className={`form_item`}>
                            <InputItem
                                type="password"
                                maxLength={16}
                                placeholder="请输入密码"
                                clear
                                onErrorClick={this.passwordErrorClick}
                                error={this.state.passwordError}
                                value={this.state.password}
                                onChange={this.passwordChange}
                            />
                        </section>
                        <section className={`form_submit`}>
                            <CheckboxItem key='1' onChange={() => {this.agreementChange()}}>我已阅读并同意<span className='blue' onClick={()=>{bd_router.push(this.props.history,'/service-agreement')}}>《中信建投机构服务APP协议》</span></CheckboxItem>
                            <Button onClick={this.doLogin} disabled={!this.state.enableSubmit}>登录</Button>
                        </section>
                    </form>
                </section>
            </section>
        )
    }
}
