import React, {Component} from 'react'
import './style/search-bar.less'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className='search'>
                <div className='title'>产品名称 </div>
                <div className='search-Box'>
                    <select name="" id="" className='seclect-box'>
                         <option value="">福建滚雪球卓越一号私募基金</option>
                    </select>
                </div>
            </div>
         );
    }
}
 
export default SearchBar;