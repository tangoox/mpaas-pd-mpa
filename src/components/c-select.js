import React,{Component} from "react";
import "../css/c-select.less";
import {Picker,List} from 'antd-mobile';

export default class CustomSelect extends Component {
    constructor(props) {
        super(props);
        if(this.props.child){
            this.props.child(this)
        }
    }
    setSeldctValue(value){
            this.setState({
                select_value:value,
                disabled:value === null
            })
    }
    state={
        select_value:this.props.data && this.props.data.length > 0 && this.props.data[this.props.initValue] && this.props.data[this.props.initValue].value?[this.props.data[this.props.initValue].value]:null,
        disabled:false
    }
    render() {
        return (
            <div className='select_contain_pb'>
                <div className='container_label_pb'>{this.props.titleLabel}</div>
                <div className='container_select_pb'>
                        <div className='select_area_pb'>
                            <div className='pick_area_flow'>
                                <Picker
                                    disabled={this.state.disabled}
                                    data={this.props.data}
                                    value={this.state.select_value}
                                    cols={1}
                                    onChange={(val)=>{
                                        this.setState({
                                            select_value:val
                                        },()=>{
                                            this.props.selectValueCallBack(val[0], this)
                                        });
                                    }}
                                    itemStyle={{fontSize:'13px',color:'#222222'}}
                                    extra={this.state.select_value ? this.state.select_value :
                                       this.props.initValue !== null && this.props.initValue !== undefined ? this.props.data[this.props.initValue].label : ""
                                    }
                                >
                                    <List.Item extra={<em className='arr'></em>}/>
                                </Picker>
                            </div>
                            {/*<div className='right_arrow'></div>*/}
                        </div>
                </div>
            </div>
        )
    }
}
