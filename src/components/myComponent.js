import React, {Component} from "react";
import {NavBar} from "antd-mobile";

/**组件**/
export default class MYNavBar extends Component{
    render(){
        return(
          <NavBarComm goBack={() => {this.props.history.goBack()}} />
        );
    }
}

class NavBarComm extends Component{ /*top navbar*/
    state = {
        label:'我的赞'
    }
    render(){
        return(
            <section className={`mynavbar`}>
                <NavBar mode="dark" leftContent={[<i key='1' className={`leftback`} onClick={this.state.goBack} />]}>{this.state.label}</NavBar>
            </section>
        )
    }
}
