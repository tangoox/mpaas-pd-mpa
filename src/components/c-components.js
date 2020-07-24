/**通用组件**/
import React, {Component} from "react";

import '../css/c-components.less'
import {List, Icon, InputItem, Picker} from "antd-mobile";
import bd_utils from "../utils/bd_utils";
import $ from "jquery";
import ReactDOM from "react-dom";
import {enableClassManagement} from "echarts/src/util/clazz";

/**产品下拉框 - 通用**/
let timeout = null;
class SelectProductCommon extends Component{
    state={
        select_value:null,
        select_item_value:null
    }
    getSelectLabel(id){
        if (this.props.data){
            for(var i = 0;i<this.props.data.length;i++){
                let item = this.props.data[i];
                if (item.value === id){
                    this.setState({
                        select_value:item.label
                    })
                    break;
                }
            }
        }
    }
    componentDidMount(){
        timeout = setTimeout(()=>{
            $(ReactDOM.findDOMNode(this.searchForm)).submit(function (e) {
                e.preventDefault();
            });
        },500);
    }

    componentWillUnmount() {
        if (timeout) {
            clearTimeout(timeout);
        }
    }

    render() {
        return(
            <section className='search_select_contain_pb'>
                <section className='search_container_label_pb'>{this.props.titleLabel}</section>
                <section className='search_container_select_pb'>
                    <section className='search_select_area_pb'>
                        <section className='search_pick_area_left'>
                            <form ref={el=>this.searchForm = el} action="">
                                <InputItem
                                    ref={el=>this.inputDiv = el}
                                    placeholder={this.props.placeholder ? this.props.placeholder : '请选择'}
                                    onChange={(val)=>{
                                        this.setState({
                                            select_value:val
                                        })
                                        this.props.selectValueCallBack(val,true)
                                        this.props.searchValueCallBack(val)
                                    }}
                                    value={this.state.select_value !== null && this.state.select_value !== undefined ? this.state.select_value :
                                        (bd_utils.isEmpty(this.props.initValue) ? "" :
                                            (bd_utils.isEmpty(this.props.data) ? "" :
                                                (this.props.data.length > 0 ? this.props.data[this.props.initValue].label : "")))}
                                    className='search_input_div'
                                    clear
                                    type="search"
                                    onKeyPress={(e)=>{
                                        if (e.which === 13){
                                            $(ReactDOM.findDOMNode(this.inputDiv)).children(".am-list-line").children(".am-input-control").children()[0].blur();
                                            if(this.props.type === 'customer'){
                                                $(".customer .search_pick_area_right .am-list-item-middle").trigger("click")
                                            }else if(this.props.type === 'product'){
                                                $(".product .search_pick_area_right .am-list-item-middle").trigger("click")
                                            }else{
                                                $(".search_pick_area_right .am-list-item-middle").eq(0).trigger("click")
                                            }
                                            //$(".search_pick_area_right .am-list-item-middle").trigger("click");
                                            this.props.searchValueCallBack(this.state.select_value,true)
                                        }
                                    }}/>
                            </form>
                        </section>
                        <section className='search_pick_area_right'>
                            <Picker
                                data={this.props.data}
                                value={this.state.select_item_value}
                                cols={1}
                                onChange={(val)=>{
                                    this.getSelectLabel(val[0]);
                                    this.props.selectValueCallBack(val[0],true)
                                    this.setState({
                                        select_item_value:val
                                    })
                                }}
                                itemStyle={{fontSize:'13px',color:'#222222'}}
                            >
                                <List.Item />
                            </Picker>
                        </section>
                    </section>
                </section>
            </section>
        )
    }
}

/**分割**/
class DivisionLine extends Component {
    render() {
        return (
            <hr style={{height: this.props.height ? this.props.height : '10px', background: this.props.background ? this.props.background :'#F8F8F8', border: this.props.border ? this.props.border :'none', margin: this.props.margin ? this.props.margin : 0 }}/>
        );
    }
}

/**暂无内容**/
class NoContent extends Component{
    render() {
        return(
            <div className='subjectMoudleNone'>
                <div className='noneDiv'></div>
                <div className='noneDes'>暂无内容</div>
            </div>
        );
    }
}

/**加载中**/
class DataLoading extends Component{
    render() {
        return(
            <section className='DataLoading tc' style={{width: '100%', padding: '30px'}}><Icon type={'loading'}/> 加载中...</section>
        );
    }
}

/**导出组件**/
export {
    SelectProductCommon,
    DivisionLine,
    NoContent,
    DataLoading
};
