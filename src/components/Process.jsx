import React,{ Component } from "react";
import  "./style/process.less"

const Line=({status="0",title="缺失"})=>{
    const color=parseInt(status)?"activeS":"grey";
    return (
        <div className={`processItem`}>
            <div className={`title ${color}`}>{title}
                <div className={`circular`}>
                    <div className="line"></div>
                </div>
            </div>
        </div>
    )
}
const ReversLine=({status="0",title="缺失"})=>{
    const color=parseInt(status)?"activeS":"grey";
    return (
        <div className={`reverseProcessItem`}>
            <div className={`title ${color}`}>{title}
                <div className={`circular`}>
                    <div className="line"></div>
                </div>
            </div>
        </div>
    )
}
const Circle=({status="0",startTitle="缺失",endTitle="缺失"})=>{
    const color=parseInt(status)?"activeS":"grey"; 
    return (
        <div className={`circleItem ${color}`}>
            <div className="top">
                {startTitle}
                <div className="circular"></div>
            </div>
            <div className="blank"></div>
            <div className="bottom">
                {endTitle}
                <div className="circular"></div>
            </div>
            <div className="center"></div>
        </div>
    )
}
const ProcessItem=({time="2020-02-21",title="无标题"})=>{
    return(
        <div className="processItem">
            <span className="processItem_icon"></span>
            <div className="processItem_time">{time}</div>
            <div className="processItem_title">{title}</div>
        </div>
    )
}
export default class Process extends Component {
    constructor(props){
        super(props)
        this.state={
        }
    }
    render(){
        const data=this.props.data||[];
        return(
             <div>
                <div className="process">
                    <Line status="1" title="准入"/>
                    <Line status="0" title="合同签署"/>
                    <Line status="0" title="募集"/>
                    <Line status="0" title="成立"/>
                    <Circle status="0" startTitle="备案" endTitle="股东卡开立"/>
                    <div className="blank"></div>
                    <ReversLine status="0" title="清盘"/>
                    <ReversLine status="0" title="产品运营"/>
                    <ReversLine status="0" title="三方挂接"/>
                </div>
                <div className="processInfoBox">
                    <h3>
                    详细流程
                    </h3>
                    <div className="process_box">
                    <ProcessItem title="准入审核" time="2020-02-21"/>
                    <ProcessItem title="个人资料修改" time="2020-02-21"/>
                    <ProcessItem title="安全密码修改" time="2020-02-21"/>
                    <ProcessItem title="股东账户加载" time="2020-02-21"/>
                    <ProcessItem title="准入完成" time="2020-02-21"/>
                    </div>
                </div> 
             </div>
        )
    }
}