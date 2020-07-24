import React, {Component} from "react";
import {List, Picker} from "antd-mobile";

export default class ProductPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sValue: [],
            pickerData: [
                [
                    {
                        label: '2013',
                        value: '2013',
                    },
                    {
                        label: '2014',
                        value: '2014',
                    },
                    {
                        label: '2015',
                        value: '2015',
                    },
                    {
                        label: '2016',
                        value: '2016',
                    },
                    {
                        label: '2017',
                        value: '2017',
                    },
                    {
                        label: '2018',
                        value: '2018',
                    },
                ]
            ]
        }
    }

    render() {
        return (
            <div className='product-picker'>
                <div className='left'>
                    产品名称
                </div>
                <div className='right'>
                    <Picker
                        data={this.state.pickerData}
                        cascade={false}
                        extra={'请选择'}
                        value={this.state.sValue}
                        onChange={v => this.setState({sValue: v})}
                        onOk={v => this.setState({sValue: v})}
                    >
                        <List.Item arrow="down"/>
                    </Picker>
                </div>
            </div>
        );
    }
}
