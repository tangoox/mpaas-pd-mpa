import React,{Component} from "react";
import {withRouter} from "react-router-dom";
/*引入组件*/
import {SelectProductCommon} from '../components/c-components'
import Api from "../services/common_api";
import bd_utils from "../utils/bd_utils";
import CONSTANTS from "../utils/constants";
import bd_storage from "../utils/bd_storage";
import pinyinUtil from "../utils/pinyin/pinyinUtil";

let CPID = '';
class CAllSelectProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CPID:'',
            productData:[],
            productDataList:[],
        }
    }

    componentDidMount() {
        /*获取用户cpId 获取用户产品列表*/
        bd_utils.getUser().then(user => {
            if (user && user.users) {
                CPID = bd_utils.getCPID(user);
                this.setState({
                    CPID: CPID,
                },()=>{
                    this.getProductListByCPID(CPID)
                })
            }
        })
    }

    /*通过用户cpId获取产品下拉列表*/
    getProductListByCPID(CPID){
        Api.findProductName({"cpId":CPID,pageSize:-1}, (data) => {
            data.forEach(item=>{
                item.des.firstLetter = pinyinUtil.getFirstLetter(item.des.productName);
                item.des.pinyin = pinyinUtil.getPinyin(item.des.productName).replace(/\s+/g,"");
            })
            this.setState({
                productData: data
            },()=>{
                bd_storage.set(CONSTANTS.CURRENCY.productList, data, true);
            });
        });
    }

    /* 模糊搜索产品 */
    searchProduct(keyWord){
        if (!bd_utils.isEmpty(keyWord)){
            this.getSelectChange(keyWord)
        }else{
            /*获取缓存产品列表*/
            bd_storage.get(CONSTANTS.CURRENCY.productList).then(data=>{
                this.setState({
                    productDataList:data
                })
            })
        }
    }
    // 获取输入内容前台过滤
    getSelectChange=(value)=>{
        const listSource = this.state.productDataList;
        const valueFirstLetter = pinyinUtil.getFirstLetter(value).toUpperCase();
        const valuepinyin = pinyinUtil.getPinyin(value);

        const filterData = listSource.filter(item=>{
            const filterItem=item.des;
            return ((filterItem.productNo ? filterItem.productNo.includes(value) : false) ||
                (filterItem.productName ? filterItem.productName.includes(value) : false) ||
                (filterItem.firstLetter ? filterItem.firstLetter.includes(valueFirstLetter) : false) ||
                (filterItem.pinyin ? filterItem.pinyin.includes(valuepinyin) : false));
        })
        this.setState({
            productData: filterData
        });
    }

    render() {
        return (
            <SelectProductCommon data={this.state.productData} placeholder={this.props.placeholder}
                                 initValue={this.props.initValue} titleLabel={this.props.titleLabel}
                                 type='product'
                                 selectValueCallBack={this.props.selectValueCallBack}
                                 searchValueCallBack={(val) => this.searchProduct(val)}
            />
        )
    }
}

export default withRouter(CAllSelectProduct);
