/** 衍生品-标的通用选择页 **/
import React,{Component} from "react";
import INavBar from "./i-navbar";
import "../css/common/underly-select.less"
import pinyinUtil from "../utils/pinyin/pinyinUtil";
class UnderlySelect extends Component{
    constructor(props) {
        super(props);
        this.state={
            placeholder:'',
            data:[],
            keyData:[],
            keyword:''
        }
    }

    componentDidMount() {
        this.setState({data:this.props.data},()=>{
            const index = this.props.index;
            const data = this.state.data;
            if(data.length > 0){
                data.map(item => {
                    item.firstLetter = pinyinUtil.getFirstLetter(item.label);
                    item.pinyin = pinyinUtil.getPinyin(item.label).replace(/\s+/g, "");
                });
                this.setState({data:data, keyData: data, keyword:this.props.keyword},()=>{
                    this.inputChange(this.state.keyword, index)
                })
            }
        });
    }

    handleItemClick(item, index, keyword){
        const data =  this.state.data;
        data.map(item=>{
            item.isCheck = false;
        });
        data[index].isCheck = true;
        item.index = index;
        this.setState({data:data},()=>{
            this.props.show(item, keyword)
        });
    }
    clear(){
        const data = this.state.data;
        if(data.length >0){
            data.map(item=>{item.isCheck=false})
        }
        this.setState({data:data});
        this.props.show({label:'',value:null,index:-1});
    }
    li(item, index){
        const type = this.props.type;
        /*标的*/
        if(type === 3){
            return <li key={index} className={item.isCheck?'check':''} onClick={()=>this.handleItemClick(item, index, this.state.keyword)}>{item.value+'      '+item.label}</li>
        }
        /*合约代码、产品名称*/
        if(type === 4){
            return <li key={index} className={item.isCheck?'check':''} onClick={()=>this.handleItemClick(item, index, this.state.keyword)}>{item.label}</li>
        }
    }
    inputChange(value,index){
        this.state.keyword = value;
        if(this.state.keyData && this.state.keyData.length > 0){
            const listSource = this.state.keyData;

            const valueFirstLetter = pinyinUtil.getFirstLetter(value).toUpperCase();
            const valuepinyin = pinyinUtil.getPinyin(value);
            const filterData = listSource.filter(item => {
                const filterItem = item;
                return ((filterItem.label ? filterItem.label.includes(value) : false) ||
                    (filterItem.firstLetter ? filterItem.firstLetter.includes(valueFirstLetter) : false) ||
                    (filterItem.pinyin ? filterItem.pinyin.includes(valuepinyin) : false));
            });
            if(index !== -1 && index!==undefined){
                filterData[index].isCheck = true;
            }
            this.setState({
                data: filterData
            });
        }
    }
    render(){
        return(
            <div className='search-container'>
                <INavBar class="inavbar whtnavbar linenavbar"
                         navlabel={''}
                         leftIcons={[{icon: 'closeS', label: '', event: () => this.props.show(null, this.state.keyword)}]}
                         rightIcons={[{icon: '', label: '清除', event: () => this.clear()}]}
                />
                <div className='search-body'>
                    <div className={'search'}><input id={'keyword'} value={this.state.keyword} onChange={(e)=>{this.inputChange(e.target.value)}} placeholder={this.state.placeholder}/><div className={'right'}></div></div>
                    <section className='productLists'>
                        <ul>
                            {this.state.data.length > 0 ? this.state.data.map((item,index)=>{
                                 return this.li(item, index);
                            }): ''}
                        </ul>
                    </section>
                </div>
            </div>
        )
    }

}

export default UnderlySelect