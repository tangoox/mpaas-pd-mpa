import React, {Component} from "react";
import {InputItem} from "antd-mobile";
import './style/searchInput.less'
/**
 * 导航搜索框通用
 * InputClick 点击事件
 * searchValue 展示内容
 * **/
export default class SearchInput extends Component{
    render(){
        return(
            <section className="searchInput_box" onClick={this.props.InputClick}>
                <InputItem value={this.props.searchValue}
                        type="search" readOnly={true} disabled={true}
                        className='productList_searchInput'
                        placeholder={this.props.placeholder}
                />
                <section className='productList_searchInput_searchLogoArea'>  </section>
            </section>
        );
    }
}
