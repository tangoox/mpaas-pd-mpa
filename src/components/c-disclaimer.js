/*免责声明通用组件*/
import React, {Component} from "react";
import '../css/c-disclaimer.less'

export default class Disclaimer extends Component{
    render(){
        return(
            <section className={`c-disclaimer`}>
                <section className={`discl-conn`}>
                    <h2>免责声明</h2>
                    <code>本资讯中的内容和意见仅供参考，并不构成对所述证
券买卖做出保证。投资者不应将本资讯作为投资决策的唯
一参考因素，亦不应该以本资讯取代自己的判断。在任何
情况下，中信建投不对任何人因使用本平台的任何内容所
引致的任何损失负任何责任。</code>
                </section>
            </section>
        )
    }
}
