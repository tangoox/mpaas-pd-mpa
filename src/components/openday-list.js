import React, {Component} from "react";
import {ListView, PullToRefresh} from "antd-mobile";
import Tip from "./tip";
import '../css/openday-list.less'
import bd_utils from "../utils/bd_utils";
import ReactDOM from "react-dom";
import $ from "jquery";
import bd_router from "../utils/bd_router";
import {NoContent} from "./c-components";

let beginScroll = false;
let scrollTimer;
export default class OpendayList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: true,
            isLoading: true,
            height: 0,
            useBodyScroll: false,
            hasMore: true,
            datas: [],
            pageNo: this.props.pageNo,
            pageSize: 10
        };
        this.onRefresh = this.onRefresh.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.refreshOver = this.refreshOver.bind(this);
        this.loadMoreOver = this.loadMoreOver.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.productNo !== this.props.productNo) {
            this.onRefresh();
            return true
        }
        return false;
    }

    onScrollStop() {
        this.props.onScrollStop();
    }

    onScrollStart() {
        this.props.onScrollStart();
    }

    componentDidMount() {
        this.setState({
            height: (document.getElementById('listItemss').offsetHeight - 20) + 'px'
        });
        this.onRefresh();

        let self = this;
        setTimeout(() => {
            let lv = $(ReactDOM.findDOMNode(this.lv));
            lv.scroll(function () {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    beginScroll = false;
                    self.onScrollStop();
                }, 250);
                if (!beginScroll) {
                    beginScroll = true;
                    self.onScrollStart();
                }
            });
        }, 500);
    }

    /**
     * 开始下拉刷新
     */
    onRefresh = () => {
        this.setState({
            pageNo: 1,
            refreshing: true,
            isLoading: true,
        }, () => {
            //发起请求
            this.refreshOver();
        });

    };

    /**
     * 下拉刷新完成
     */
    refreshOver() {
        if (this.props.refresh && this.props.index !== null) {
            this.props.refresh(this.props.index, this.state.pageNo, (data) => {
                if (bd_utils.isEmpty(data)) {
                    console.error("refresh function fail by tab " + this.props.index);
                    this.setState({
                        refreshing: false,
                        isLoading: false,
                    });
                } else {
                    this.setState({
                        hasMore: data.pageNo < data.pages,
                        dataSource: this.state.dataSource.cloneWithRows(data.list),
                        refreshing: false,
                        isLoading: false,
                        datas: data.list,
                    });
                }
            });
        } else {
            console.error("null refresh function");
            this.setState({
                refreshing: false,
                isLoading: false,
            });
        }

    }

    /**
     * 开始加载更多
     * @param event
     */
    onEndReached = (event) => {
        if (!this.state.hasMore) {
            return;
        }
        this.setState({
            isLoading: true,
            pageNo: this.state.pageNo + 1
        }, () => {
            //发起请求
            this.loadMoreOver();
        });
    };

    /**
     * 加载更多完成
     */
    loadMoreOver() {
        let tips;
        if (this.props.more && this.props.index !== null) {
            this.props.more(this.props.index, this.state.pageNo, (data) => {
                //加载到数据
                if (bd_utils.isEmpty(data)) {
                    tips = "loadMore function fail by tab " + this.props.index;
                    console.error(tips);
                    this.setState({
                        isLoading: false,
                        hasMore: false
                    });
                } else {
                    let tempData = this.state.datas;
                    tempData.push(...data.list);
                    console.error(data.pageNo < data.pages);
                    this.setState({
                        datas: tempData,
                        hasMore: data.pageNo < data.pages,
                        dataSource: this.state.dataSource.cloneWithRows(tempData),
                        isLoading: false,
                    });
                }
            });
        } else {
            tips = "null loadMore function";
            console.error(tips);
            this.setState({
                isLoading: false,
                hasMore: false
            });
        }

    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div className="openday-item-body" key={rowID} onClick={() => {
                    bd_router.push(this.props.history, '/netWorthQuery', {
                        data: {
                            cpId: this.props.CPID,
                            productId: rowData.id,
                            productNo: rowData.productNo,
                            productName: rowData.productName
                        }
                    })
                }}>
                    <div className='item_hd'>
                        <span className='date'>{bd_utils.dateFormat(rowData.openDate, 'YYYY-mm-dd ')}</span>
                        <span className='proType'>{bd_utils.notNull(rowData.businessType) + '/' + bd_utils.notNull(rowData.openType)}</span>
                    </div>
                   <div className='item_bd'>
                       <div className='item_c'>
                           <div className='openday-item-body-top'>
                               <div className='subject'>{bd_utils.notNull(rowData.productName, '')}</div>
                               <div className='count'>{''}</div>
                           </div>
                           <div className='openday-item-body-bottom'>
                               <div className='proTag'>
                                   <span className='code'>{bd_utils.notNull(rowData.productNo, '')}</span>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
            );
        }

        return (
            <section id='listItemss' className='listItemss'>
                {this.state.datas.length > 0 ?
                    <ListView className='mylv' key={'1'} ref={el => this.lv = el}
                              dataSource={this.state.dataSource}
                              renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                                  {this.state.isLoading ? '加载中...' : '没有更多数据了'}
                              </div>)}
                              renderRow={row}
                              useBodyScroll={false}
                              style={{height: this.state.height}}
                              pullToRefresh={<PullToRefresh
                                  refreshing={this.state.refreshing}
                                  onRefresh={() => {
                                      this.onRefresh();
                                  }}
                                  distanceToRefresh={80}/>}
                              onEndReached={() => {
                                  this.onEndReached();
                              }}
                              pageSize={10}
                    /> : <NoContent />}
            </section>
        );
    }

}
