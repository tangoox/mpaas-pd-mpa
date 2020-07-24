import React, {Component} from "react";
import '../css/inavbar.less'
/**
 * navbar 顶部导航[返回，标题，图标按钮] 通用组件
 * class属性：inavbar 默认透明背景 | bgnavbar 带背景图片 | whtnavbar 白色背景 | linenavbar 带底部线条
 * *    leftIcons：默认无 | leftback 返回箭头默认黑色 | whtback 返回箭头白色 | {icon | 图标:'',label | 名称:'',event | 事件:''}
 * *    navlabel：导航标题名称
 * *    rightIcons: 自定义图标按钮  | {icon | 图标:'',label | 名称:'',event | 事件:''}
 * **/
export default class INavBar extends Component{
    render(){
        return(
            <section className={this.props.class}>
                <section className={`navbar-left`}>
                    {this.props.leftIcons?this.props.leftIcons.map((item,index)=>{
                        return <i key={index} className={item.icon} onClick={item.event}>{item.label}</i>
                    }):''}
                </section>
                <section className={`navbar-title`}>{this.props.navlabel}</section>
                <section className={`navbar-right`}>
                    {this.props.rightIcons?this.props.rightIcons.map((item,index)=>{
                        return <i key={index} className={item.icon} onClick={item.event}>{item.label}</i>
                    }):''}
                </section>
            </section>
        );
    }
}
