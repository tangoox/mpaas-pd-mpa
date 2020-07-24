import React,{Component} from "react";
import "../css/c-search-product.less";
import {Picker,List,InputItem} from 'antd-mobile';
import bd_utils from "../utils/bd_utils";
import $ from 'jquery';
import ReactDOM from 'react-dom';

export default class CustomSearchProduct extends Component {
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
        setTimeout(()=>{
            $(ReactDOM.findDOMNode(this.searchForm)).submit(function (e) {
                e.preventDefault();
            });
        },500);
    }
    render() {
        return (
            <div className='search_select_contain_pb'>
                <div className='search_container_label_pb'>{this.props.titleLabel}</div>
                <div className='search_container_select_pb'>
                    <div className='search_select_area_pb'>
                        <div className='search_pick_area_left'>
                            <form ref={el=>this.searchForm = el} action="">
                            <InputItem
                                ref={el=>this.inputDiv = el}
                                placeholder={this.props.placeholder ? this.props.placeholder : '请选择'}
                                onChange={(val)=>{
                                this.setState({
                                    select_value:val
                                })
                                    this.props.selectValueCallBack(val,true)
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
                                               this.props.searchValueCallBack(this.state.select_value,true)
                                           }
                                       }}/>
                            </form>
                        </div>
                        <div className='search_pick_area_right'>
                            <Picker
                                data={this.props.data}
                                value={this.state.select_item_value}
                                cols={1}
                                onChange={(val)=>{
                                    this.getSelectLabel(val[0]);
                                    this.props.selectValueCallBack(val[0])
                                    this.setState({
                                        select_item_value:val
                                    })
                                }}
                                itemStyle={{fontSize:'13px',color:'#222222'}}
                            >
                                <List.Item/>
                            </Picker>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
