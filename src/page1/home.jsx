import React, { Component } from 'react'
import banner_data from '../config/data/home_topics_banner.json';
import gride_data from '../config/data/home_icon_grids.json';
import newInfoData from '..//config/data/home_new_notice.json';
import Swiper from 'swiper/js/swiper.js'
import 'swiper/css/swiper.min.css'
import { Carousel, Modal,InputItem} from 'antd-mobile';
import INavBar from "../components/i-navbar";
import Tip from '../components/tip';
import '../css/hosting/hosting.less';
import echarts from 'echarts/lib/echarts';
import cus_calendar from '../utils/cus_calendar';
import activity_type_json from "../config/data/research_activity_types";
// import ProductDetail from './product/productDetail'
import 'echarts/lib/chart/gauge' //
import 'echarts/lib/chart/pie' //
import 'echarts/lib/component/tooltip'; //eachart 提示
import 'echarts/lib/component/title';// title 组件
// import api_services from '../../services/online_servers'
import bd_bus from '../utils/bd_bus';
import bd_router from "../utils/bd_router";
import bd_utils from "../utils/bd_utils";
import homeApi from '../services/home_api';
import bd_storage from "../utils/bd_storage";
import constants from "../utils/constants";

const now = new Date();
const alert = Modal.alert;

// banner
class HomeCarousel extends Component {
   state={
            data: banner_data.data.items,
            banner_dura: banner_data.data.dura * 1000
        }
    componentDidMount(){
        const {data}=this.state
        homeApi.findBusinessList({ pageNo:1, pageSize: 1}, res => {
            if(res.list.length>0){
                const {title}=res.list[0];
                const newitem={title,path:'/newDynamicDetail',img:data[0].img,type:1,data:res.list[0]}
                data[0]=newitem;
                this.setState(
                    {data:data}
                )
            }
        }) 
        homeApi.findNotice({ pageNo:1, pageSize: 1, cpId:"allCompany"}, res => {
            if(res.list.length>0){
                const {title}=res.list[0];
                const newitem={title,path:'/newDynamicDetail',img:data[1].img,type:2,data:res.list[0]}
                data[1]=newitem;
                this.setState(
                    {data:data}
                )
            }
        })  
    }
    render() {
        return (
            <div className='home_Carousel'>
                <Carousel dotStyle={{ backgroundColor: 'lightgray' }}
                    dotActiveStyle={{ backgroundColor: 'white' }}
                    autoplay={true}
                    infinite={true}
                    autoplayInterval={this.state.banner_dura}
                    cellSpacing={0}
                >
                   {
                     this.state.data.map((val,index) => (
                        <div className='imageContainer' key={index} onClick={()=>this.gotoPath(val.path,val.data,val.type)}
                            style={{ display: 'inline-block' }}>
                            <img src={`${process.env.PUBLIC_URL}/config/data/${val.img}`}
                                alt="" style={{ verticalAlign: 'top' }}   
                            />
                            <div className="imgTitle">{val.title}</div>    
                        </div>
                    ))  
                   } 
                </Carousel>
            </div>
        );
    }

    gotoPath(path,params,type){
        if (path){
            console.log(path,params,type,bd_utils.isEmpty(params),"111111111111111111")
            if(bd_utils.isEmpty(params)){
                bd_router.push(this.props.history,path)
            }else{
                if(type===1){
                    bd_router.push(this.props.history,path,{type:1,data:{navTitle:'新业务',type:2,dataObj:params}})
                }else if(type===2){
                    bd_router.push(this.props.history,path,{type:1,data:{navTitle:'新通知',type:1,dataObj:params}}) 
                }            
            }
        }
    }
}

// menu
class HomeServiceMenu extends Component {
    goGrideItem(node) {
        if (node.route) {
            bd_router.push(this.props.parentProps, node.route, { type: 1 })
        } else {
            Tip.info("服务正在建设中...")
        }
    }

    getMenuStyle() {
        var views = [];
        for (var i = 0; i < gride_data.data.items.length; i++) {
            let nodeData = gride_data.data.items[i];
            let item = <div onClick={() => {
                this.goGrideItem(nodeData)
            }} key={nodeData.title} className='menu'>
                <div className='images'
                    style={{ backgroundImage: "url(" + process.env.PUBLIC_URL + "/config/data/" + nodeData.img + ")" }}></div>
                <div className='title'>{nodeData.title}</div>
            </div>;
            views.push(item);
        }
        return (views);
    }

    render() {
        return (
            <div className='home_service_menu'>
                {this.getMenuStyle()}
                <div className='home_split_line'></div>
            </div>
        );
    }
}

class NewInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    getNewInfo() {
        let List = []
        // let data =JSON.parse(newInfoData)
        let data = newInfoData.data.items
        for (let i = 0; i < data.length; i++) {
            // let item= <div className="item " style={{backgroundImage:"url("+ '../../../public'+"/config/data/"+ data[i].img + ")"}}>
            let item = <div onClick={() => {
                bd_router.push(this.props.parentPropsHistory, '/newDynamic', {
                    type: 1,
                    data: {tabIndex: i}
                });
            }} className="item" key={data[i].img}
                style={{ backgroundImage: "url(" + process.env.PUBLIC_URL + "/config/data/" + data[i].img + ")" }}>
                {/* 新业务 */}
                {/* <span> {data[i].title} </span> */}
            </div>
            List.push(item)
        }
        return List
    }

    render() {

        return (
            <section className='newInfo'>
                {this.getNewInfo()}
            </section>
        );
    }
}

class Gauge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gaugeChart: '',
            data: [
                // {value: 1, name: '产品运营'},
                // {value: 0, name: '募集'},
                // {value: 0, name: '已清盘'},
            ]
        }
        this.chart = null;
        this.initGuage.bind(this)
    }

    componentDidMount() {

        this.initGuage(this.state)
        window.addEventListener('resize', this.resize)
    }

    componentDidUpdate() {
        window.addEventListener('resize', this.resize)
    }

    componentWillReceiveProps(props) {
        const {data:{setupData,raiseData,clearData},status}=props
        if(!status){
            return;
        }
        const newData=[
            {value: setupData, name: '产品运营'},
            {value: raiseData, name: '募集'},
            {value: clearData, name: '已清盘'},
        ]
        let option = {
            // backgroundColor: '#0E1327',
            tooltip: {
                formatter: "{b} : {d}%"
            },
            color:['#E83637','#E4B451','#A6B6C8'],
            series: [
                {
                    name: "",
                    type: "pie",
                    // center: ['20%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    hoverAnimation:false,
                    labelLine: {
                        show: false
                    },
                    data: newData
                }
            ]
        };
        this.unpdata(option)
    }

    initGuage=(val)=> {
        let data = val.data
        this.chart = echarts.init(document.getElementById('gauge'))
        let option = {
            // backgroundColor: '#0E1327',
            tooltip: {
                formatter: "{b} : {d}%"
            },
            color:['#E83637','#E4B451','#A6B6C8'],
            series: [
                {
                    name: "",
                    type: "pie",
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    hoverAnimation:false,
                    labelLine: {
                        show: false
                    },
                    data: data
                }
            ]
        };
        this.chart.setOption(option)
        this.chart.resize()
    }
    unpdata=(option)=>{
        this.chart.setOption(option)
        this.chart.resize()
    }
    resize = () => {
        this.chart.resize()
    }

    render() {
        return (
            <div className='echartBox'>
                <div id="gauge"></div>
            </div>
        );
    }
}

class ProductCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    showProductName=(item)=>{
        console.log(item)
        const alertInstance = alert(<i className={`close`}
        onClick={() => alertInstance.close()}></i>,
        <section className='pro-list'>
            <section className='itemHome'>
                <section className='redpoint tl'>●</section>
                <section className='f2 tl'>
                    <p>{item.productName}</p>
                </section>
            </section>
        </section>, []
    );
    }
    CarouselChildrenFactory = () => {
        const compare = function (a, b) {
            return a.newDate > b.newDate ? 1 : -1;
        };
        const data = JSON.parse(JSON.stringify(this.props.data))
        data.sort(compare);
        const result = [];
        for (let i = 0; i < data.length; i += 3) {
            result.push(data.slice(i, i + 3));
        }
        const list = result.map((parentsitem, index) => {
            const len = 3 - parentsitem.length;
            if (len > 0) {
                for (let i = 0; i < len; i += 1) {
                    parentsitem.push({})
                }
            }
            const children = parentsitem.map((item, index) =>
                item.id ? (
                    <div className='fl' key={item.id}>
                        <p><span className="time">
                            ● {item.type === 'openDay' ? item.openDate.substring(0, 10) : item.type === 'publishDay' ? item.publishDate.substring(0, 10) : item.raiseDate.substring(0, 10)}<br/>
                                <span className="timeType">{item.type === 'openDay' ? '开放日' : item.type === 'publishDay' ? '成立日' : '过期日'}</span>
                            </span>
                            <span className="content" onClick={()=>{this.showProductName(item)}}>
                                {item.productName.length<=25?item.productName:item.productName.substring(0,22)+"..."}
                            </span>
                        </p>
                    </div>
                ) :
                    (
                        <div className='fl' key={index}>
                            <p>
                                <span className="time">&nbsp;</span>
                                <span className="content">&nbsp;</span>
                            </p>
                        </div>
                    )
            )
            return (
                <div className='c_l_c' key={index}>
                    {children}
                </div>
            )
        })
        return list;
    }
    getTipList = () => {
        const tipList = this.props.data.length > 0 ?
            (
                <Carousel className="my-carousel"
                    vertical={true}
                    dots={false}
                    dragging={false}
                    swiping={false}
                    autoplayInterval={banner_data.data.dura * 1000}
                    autoplay={true}
                    infinite={true}
                >
                    {this.CarouselChildrenFactory()}
                </Carousel>
            )
            : (
                <section className='c_l_c nomessage' key="1">
                    <section className='fl'>
                        <p>暂无成立日、开放日、非居民涉税的待办事项</p>
                    </section>
                    <section className='fr'>
                    </section>
                </section>
            )
        return tipList;
    }

    render() {
        const tipList = this.getTipList()
        return (
            <div>
                {tipList}
            </div>
        );
    }
}


class GoodsList extends Component {
    render() {

        return (
            <div>
                {/* <GoodsItem props={this.state.data}/> */}
                {

                    this.props.data.length > 0 ? this.props.data.map((itme, index) => {
                        return (<div className="productItems" key={index} onClick={() => {
                            bd_router.push(this.props.parentProps.history,"/netWorthQuery",{data:{ productId: itme.productId, productNo: itme.productNo, productName:itme.productName}})
                        }}>
                            <div className='proSubject'>
                                <div className='subject'> {itme.productName}</div>
                                <div className='jzcount'> {itme.productJz}</div>
                            </div>
                            <div className='proSubjects'>
                                <div className='proTag'>
                                    <span className='code'> {itme.productNo}</span>
                                    <span className='proType'>{itme.publishStatus} </span>
                                </div>
                                <div
                                    className='time'> {bd_utils.dateFormat(itme.publishDate, "YYYY-mm-dd")}</div>
                            </div>
                        </div>);
                        // itemList.push(item)
                    }) : <div className='nodata'> 暂无数据 </div>
                }
            </div>

        );
    }
}

var swiper;

class WeekView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weekData: this.props.weekData,
            sceneData: this.props.sceneData,
            dateTo: this.props.dateTo,
            curr: this.props.curr,
            day: this.props.day
        }
    }

    componentDidMount() {
        this.props.onRef(this)
        this.setState({
            sceneData: this.props.sceneData,
            clickTime: '',
            yearOrMonth: now.getFullYear() + '年' + (now.getMonth() + 1) + "月",
        })

    }

    componentDidUpdate() {
    }

    componentWillReceiveProps(nextProps) {

        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {

            this.setState({
                weekData: cus_calendar.getMonthBetween(),
                sceneData: nextProps.sceneData,
                sceneShowData: nextProps.sceneData,
                curr: nextProps.curr,
                day: nextProps.day,
            })
            return true;
        }
        return false;
    }

    // shouldComponentUpdate(){
    //     if(this.state.clickTime){
    //         this.showAlert(this.state.clickTime)
    //     }

    // }
    showSelected=(time)=>{
        const {weekData,sceneData}=this.state;
        // 判断是否是已选中节点再次点击，如果是再次点击，取消选中状态，走马灯显示全部信息，否则添加选中状态，数据过滤
        const clickItem=weekData.filter(item=>item.y_m_d===time)
        if(clickItem[0].now){
            for(let i=0;i<weekData.length;i++){
                weekData[i].now=false;
            }
            this.setState({weekData,sceneShowData:sceneData},()=>{swiper.update()});
        }else{
            for(let i=0;i<weekData.length;i++){
                    weekData[i].now=time===weekData[i].y_m_d?true:false;
            }
            const FilterSceneData=sceneData.filter(item=>{return item.newDate===time})
            this.setState({weekData,sceneShowData:FilterSceneData},()=>{swiper.update()});
        }
    }
    showAlert = (time) => {
        this.showSelected(time)
        let currentTimeProduct = []
        let data = JSON.parse(JSON.stringify(this.state.sceneData))
        if (data.length > 1) {
            this.state.sceneData.forEach(item => {
                if (item.newDate === time) {
                    currentTimeProduct.push(item)
                }
            })
        }
        let proItem = []
        if (currentTimeProduct.length >= 1) {
            for (let i = 0; i < currentTimeProduct.length; i++) {
                let item = <section className='itemHome' key={currentTimeProduct[i].id}>
                    <section className='redpoint tl'>●</section>
                    <section className='f2 tl'>
                        <p>{currentTimeProduct[i].productName}</p>
                        <p className="info">{currentTimeProduct[i].type === 'openday' ? '开放日' : currentTimeProduct[i].type === 'publishDay' ? '成立日' : '过期日'}</p>
                    </section>
                </section>;
                proItem.push(item)
            }
        } else {
            let items = <section className='itemHome' key="none">
                <section className='point tl'>●</section>
                <section className='f2 tl'>
                    <p>暂无提示消息..</p>
                </section>
            </section>;
            proItem.push(items)
        }
        const alertInstance = alert(<i className={`close`}
            onClick={() => alertInstance.close()}></i>,
            <section className='pro-list'>
                {proItem}
            </section>, []
        );
    };

    render() {
        return (
            <section className='week_View'>
                <section className='month-title-index'>{this.state.yearOrMonth}</section>
                {/* 日历 swiper-no-swiping */}
                <section className="swiper-container">
                    <section className="swiper-wrapper">
                        {this.getSlideData().map((item,index)=>{
                                     return <section  className="swiper-slide" data-date={item.y_m_d} key={index}>
                                                <section className="week-items">
                                                    <p>{item.week}</p>
                                                    <span className="caledr" ><span className={item.now?"redCircle":""} >{item.date}</span></span>
                                                    <span className={`${item.count === 1 ? "broundPoint " : ""} ${item.now? "tipPoint" : ""}`}></span>
                                                </section>
                                            </section>
                        })}
                    </section>
                </section>
                {/* 提示信息 */}
                <section className={this.props.cpId?'cc_list':"cc_list_unload"}>
                    {this.props.cpId?
                    <ProductCarousel data={this.state.sceneShowData} cpId={this.props.cpId}/>
                    :<UnloadBox/>
                    }
                </section>
            </section>
        );
    }
    getSlideData=()=>{
            var slides = [];
            let {weekData,sceneData:carData} = this.state;
            for (var i = 0; i < weekData.length; i += 1) {
                let ress = {};
                ress.date = weekData[i].date;
                ress.week = weekData[i].week;
                ress.y_m_d = weekData[i].y_m_d;
                ress.now=weekData[i].now?weekData[i].now:false;
                ress.count = 0
                for (let j = 0; j < carData.length; j++) {
                    if (ress.y_m_d === carData[j].newDate) {
                        ress.count = 1;
                    }
                }
                slides.push(ress);
            }
            return slides;

    }
    initSwiper = () => {
        /*渲染周视图*/
        let _this = this;
        if(swiper){
            swiper.update();
            return;
        }
        swiper = new Swiper('.swiper-container', {
            slidesPerView: 7,
            centeredSlides: true,
            cache: false,
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            allowTouchMove: false,
            touchMoveStopPropagation: false,
            observer:true,
            on: {
                click: function (event) {
                    if(_this.props.cpId){
                        _this.showAlert(event.target.offsetParent.dataset.date);
                        event.stopPropagation()
                    }
                },
            },

        });
        if (swiper.slides && swiper.slides.length > 0) _this.slideTo(this.props.slideTo)
    }

    slideTo(to) {
        swiper.slideTo(to, 500);
    }
}
const UnloadBox=()=>{
    return (
        <div className="unloadbox">
            <div className="imageBox"></div>
            <p>请登录后查看</p>
        </div>
    )
}
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnStyle: {
                borderRadius: "50%"
            },
            freshZmd: false,
            modal: false,
            day: new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime(),
            curr: new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime(),
            currs: new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime(),
            slideTo: this.getSlideTo(),
            total: 0,
            isOpen: false,
            activityTabs: activity_type_json.data.items,
            mtvKey: 0,
            dateTo: 366,
            wkindex: 1,
            sceneData: [],
            weekData: cus_calendar.getMonthBetween(),
            activityData: [],
            pageNo: 1,
            pageSize: 5,
            productData: {},
            proGaugedata: {
                clearData: 0,
                setupData: 1,
                raiseData: 0,
            },
            productList: [],
            stime: '',
            etime: "",
            proCalendarData: [],
            positionX: document.documentElement.clientWidth - 80,
            positionY: document.documentElement.clientHeight - 160,
            productListDataSource: [],
            cpId: "",
            status:false,
            searchValue:"",
            searchProductNo:""
        }
        // this.positionX=300;
        // this.positionY=520;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let flag = bd_utils.shouldComponentUpdate("Home", nextProps, nextState, this.state);
        if (flag === false) {
            this.setState({
                freshZmd: true
            });
        }
        return flag;
    }
    componentDidMount() {
        this.drag('Services');
        this.drag('onLineSer');
        this.init()
        bd_bus.bd_addListener("home_selectProduct", this.selectProduct);
    }
    componentWillReceiveProps() {
        this.init()
    }
    componentWillUnmount(){
        bd_bus.bd_remove_listener("home_selectProduct", this.selectProduct);
    }
    // 初始化信息
    init = () => {
        const {cpId}=this.state;
        if(cpId) return;
        bd_utils.getUser().then(
            user => {
                if (!bd_utils.isEmpty(user) && !bd_utils.isEmpty(user.users) && !bd_utils.isEmpty(user.users.thirdId)) {
                    this.getProductInfoLIst(user.users.thirdId)
                    this.getCalendar(user.users.thirdId)
                    this.getproductTotal(user.users.thirdId)
                    this.setState({ cpId: user.users.thirdId },()=>{
                        this.searchProduct("")
                    })
                } else {
                    this.weekview.initSwiper()
                    this.setState({
                        proGaugedata: {
                            clearData:1, setupData:0, raiseData:0
                        },
                        status:true
                    })
                }
            })
    }
    // 获取产品列表信息
    getProductInfoLIst=(cpId)=>{
        homeApi.productList_query({ cpId, pageSize: 3 }, res => {
            this.setState({
                productListDataSource: res.list
            })
        })
    }
    // 获取当前居中节点的时间点
    getSlideTo = () => {
        const year = now.getFullYear();
        // 根据是否是闰年判断基础偏移量
        const baseIndex = (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
        const curr = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate());
        const weekInterval = 3 - (curr.getDay() === 0 ? 7 : curr.getDay());
        return baseIndex + weekInterval;
    }
    onClose = key => () => {
        const el = document.querySelectorAll('.am-modal-wrap')
        const mask = document.querySelectorAll('.am-modal-mask')
        el[0].style.display = 'none'
        mask[0].style.display = 'none'
    }
    //因避免客服系统关闭重开产生重复消息 此处做隐藏 不做关闭
    getOnlineSer = () => {
        if (!this.state.modal) {
            this.setState({
                modal: true
            })
        } else {
            const el = document.querySelectorAll('.am-modal-wrap')
            const mask = document.querySelectorAll('.am-modal-mask')
            el[0].style.display = 'block'
            mask[0].style.display = 'block'
        }
    }
    handerCurr = currs => {
        this.setState({
            currs: new Date(currs).getTime()
        })
    }
    getCalendar = (cpId, productNo) => {

        let startTime, endTime;
        bd_utils.CurrentWeekStartEndTime((sTime, eTime) => {
            startTime = bd_utils.formatTime(sTime)
            endTime = bd_utils.formatTime(eTime)
        })
        let params = {
            cpId,
            startTime,
            endTime
        }
        productNo ? params.productNo = productNo : void 0;
        homeApi.getProduct_calendar(params, res => {
            if (res && JSON.stringify(res) !== "{}") {
                res.openList.forEach(item => {
                    item.type = 'openDay'
                    item.newDate = bd_utils.dateFormat(item.openDate,"YYYY/m/d")
                })
                res.publishList.forEach(item => {
                    item.type = 'publishDay'
                    item.newDate = bd_utils.dateFormat(item.publishDate,"YYYY/m/d")
                })
                res.closeList.forEach(item => {
                    item.type = 'closeDay'
                    item.newDate = bd_utils.dateFormat(item.raiseDate,"YYYY/m/d")
                })
                let list = [...res.openList, ...res.publishList, ...res.closeList]
                this.setState({
                    proCalendarData:list,
                    sceneData: list
                }, () => {
                    this.weekview.initSwiper()
                })
            }
        },()=>{this.weekview.initSwiper()})
    }
    getproductTotal = (cpId) => {
        homeApi.productTotal({ cpId }, res => {
            if (res && JSON.stringify(res) !== "{}") {
                const clearData = bd_utils.FloatLengthFormat(res['businessNum'] / res['productNum'], 4);
                const setupData = bd_utils.FloatLengthFormat(res['publishNum'] / res['productNum'], 4);
                const raiseData = bd_utils.FloatLengthFormat(res['raiseNum'] / res['productNum'], 4);
                this.setState({
                    proGaugedata: {
                        clearData, setupData, raiseData
                    },
                    productData: res,
                    status:true
                })
            }
        }, ()=>{
            this.setState({
                proGaugedata: {
                    clearData:0, setupData:1, raiseData:0
                },
                status:true
            })
        })
    }
    // 拖拽功能实现
    drag = (id) => {
        var oDiv = document.getElementById(id);

        let disX, disY, moveX, moveY, L, T

        oDiv.addEventListener('touchstart', function (e) {
            // e.preventDefault();
            disX = e.touches[0].clientX - this.offsetLeft;
            disY = e.touches[0].clientY - this.offsetTop;
        });
        oDiv.addEventListener('touchmove', function (e) {
            e.preventDefault();
            L = e.touches[0].clientX - disX;
            T = e.touches[0].clientY - disY;

            if (L < 0) {
                L = 0;
            } else if (L > document.documentElement.clientWidth - this.offsetWidth) {
                L = document.documentElement.clientWidth - this.offsetWidth;
            }

            if (T < 0) {
                T = 0;
            } else if (T > document.documentElement.clientHeight - this.offsetHeight) {
                T = document.documentElement.clientHeight - this.offsetHeight;
            }
            moveX = L + 'px';
            moveY = T + 'px';
            this.style.left = moveX;
            this.style.top = moveY;
        });
    }
    //搜索框
    searchProduct = (keyWord,pageSize=-1) => {
        let obj = {
            "productName": keyWord,
            "cpId": this.state.cpId,
            pageSize
        };
        let that = this;
        homeApi.product_list(obj, function (data) {
            if (data && data.length > 0) {
                that.setState({
                    productList: data,
                });
            } else {
                Tip.info("查无此产品")
            }
        });
    }

    selectProduct = (product) => {
        let {cpId} = this.state
        this.setState({searchValue:product.productName,searchProductNo:product.productNo})
        if (!bd_utils.isEmpty(product)) {
            this.getCalendar(cpId,product.productNo)
        }else{
            this.getCalendar(cpId)
        }
    }
    unloadTip=()=>{
        Tip.info(<span><span class="tipredcirle">&nbsp;</span>请登录后查看</span>)
    }
    showFormat = (data) => {
        if(bd_utils.isEmpty(data)){
            return false
        }
        const len = Number.parseFloat(data).toString().length;
        if (len >= 10) {
            let parseData = parseInt(data, 10)
            return Object.prototype.toLocaleString.call(parseInt(parseData / 10000)).replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
                return s+','
            })
        }else{
            let numStr=Number.parseFloat(data).toString();
            const numArry=numStr.split(".");
            if(numArry.length>1){
                return numArry[0].replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
                    return s+','
                })+numArry[1]
            }else{
                return numArry[0].replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
                    return s+','
                })
            }
        }
    }
    loadOut=()=>{
       const alertInstance = alert(
            <i className={`closeCircle`} onClick={() => {alertInstance.close()}}></i>,
            <section className={`alertContent`}>
                <div className="content">确定要从目前账号中退出？</div>
                <div className="botBtn">
                    <span className="cancle"
                    onClick={() => {alertInstance.close()}}
                    >
                        取消
                    </span>
                    <span
                        className="ok"
                        onClick={()=>{
                            bd_storage.get(constants.KEYS.userId).then(uid => {
                                bd_storage.set(constants.KEYS.userId, '', true);
                                bd_utils.setUser(uid, constants.KEYS.user,'').then(r=>{
                                    bd_router.exiTApp();
                                })
                            });
                            this.setState({
                                cpId:"", 
                                proGaugedata: {
                                    clearData:1, setupData:0, raiseData:0
                                },
                                status:true
                            })
                            alertInstance.close()
                        }}>
                    确认
                    </span></div>
            </section> ,
            [])
    }
    searchClick=()=>{
        bd_router.push(this.props.history,"/common-search",{data:{productNo:this.state.searchProductNo,backEvent:"home_selectProduct",dataKey:"home_searchList"}});
        bd_storage.set('home_searchList',this.state.productList);
    }
    gopage=()=>{
        window.location.href="./page2.html"
    }
    gopage2=()=>{
        Tip.info("打开");
        if (window.AlipayJSBridge){
            Tip.info("打开1");
            let params = {url: "./page3.html"}
            window.AlipayJSBridge.call('pushWindow',
                params,
                (result) => {
                    Tip.info(result ? result.code : "打开失败");
                }
            );
        }
    }
    render() {
        const {cpId}=this.state;
        const label=cpId?"注销":"登录";
        return (
            <div className='home_container'>
                <INavBar class={`inavbar whtnavbar linenavbar`} navlabel='托管外包'
                         leftIcons={[{icon: 'leftback', label: '', event: () => {bd_router.exiTApp();}}]}
                         rightIcons={[{icon: 'logout event-click', label:label, event: () => {
                                 cpId?
                                   this.loadOut()
                                 :
                                    bd_router.push(this.props.history, "/login")
                            }}]}
                />
                <section className='ibody'>
                    <section className='scrollBody'>
                        <HomeCarousel history={this.props.history}/>
                        <HomeServiceMenu parentProps={this.props.history} />
                        <NewInfo parentPropsHistory={this.props.history} />
                        {/* <GetproductTotal props={this.state.productData}/> */}
                        <section className='product'>
                            <div className='productAcount' onClick={this.gopage2}>
                                产品总数: <span className={cpId?"":"unload"}>{cpId?this.state.productData['productNum'] || 0:"请登录后查看"}</span>
                            </div>
                            <div className='productMain'>
                                <div className='left'>
                                    <div className='productItem'>
                                        <div
                                            className={cpId?`productText setUP`:`productText setUP unload`}> {cpId?bd_utils.accMul(this.state.proGaugedata.setupData,100).toString()+ "%":"一"}
                                        </div>
                                        <div className='pro_item_style'> 运营
                                            : {cpId?this.state.productData['publishNum']===0?0:(this.state.productData['publishNum'] || 0):""} </div>
                                    </div>
                                    <div className='productItem'>
                                        <div
                                            className={cpId?`productText mj`:`productText mj unload`}> {cpId?bd_utils.accMul(this.state.proGaugedata.raiseData,100).toString() + "%":"一"}
                                        </div>
                                        <div className='pro_item_style'> 募集
                                            : {cpId?this.state.productData['raiseNum']===0?0:(this.state.productData['raiseNum']||0):""}  </div>
                                    </div>
                                    <div className='productItem'>
                                        <div
                                            className={cpId?`productText liquidation`:`productText liquidation unload`}> {cpId?bd_utils.accMul(this.state.proGaugedata.clearData,100).toString() + "%":"一"}
                                        </div>
                                        <div className='pro_item_style'> 已清盘
                                            : {cpId?this.state.productData['businessNum']===0?0:(this.state.productData['businessNum']||0):""}  </div>
                                    </div>
                                </div>
                                <div className='middle'>
                                    <Gauge data={this.state.proGaugedata} status={this.state.status}/>
                                </div>
                                <div className='right'>
                                    <div className='productItem'>
                                        <div
                                            className={cpId?`acount_item setUP`:`acount_item setUP unload`}>{cpId?this.showFormat(this.state.productData['feCount'] )|| 1:"一"} </div>
                                        <div className='pro_item_style'>份额总数{cpId&&Number.parseFloat(this.state.productData['feCount']).toString().length>=10?"/万":""}</div>
                                    </div>
                                    <div className='productItem'>
                                        <div
                                            className={cpId?`acount_item`:`acount_item unload`}> {cpId?this.state.productData['customerNum'] || 1:"一"}  </div>
                                        <div className='pro_item_style'>客户总数</div>
                                    </div>
                                    <div className='productItem'>
                                        <div
                                            className={cpId?`acount_item asset`:`acount_item asset unload`}> {cpId?this.showFormat(this.state.productData['zcCount'])|| 1:"一"}   </div>
                                        <div className='pro_item_style'>总资产{cpId&&Number.parseFloat(this.state.productData['zcCount']).toString().length>=10?"/万元":"/元"}</div>
                                    </div>
                                </div>
                            </div>


                        </section>
                        <section className='calendar'>
                            <div className='searchBox'>
                                <div className='Search' onClick={this.searchClick}>
                                <InputItem value={this.state.searchValue.length<=12?this.state.searchValue:this.state.searchValue.slice(0,12)+"..."}
                                                   type="search" readOnly={true} disabled={true}
                                                   className='home_searchInput'
                                                   placeholder={cpId?"选择产品":"请登录后查看"}
                                        />
                                </div>
                                <div className='btn'>
                                    {/* <span className='seting'></span> */}
                                    {/* <span className="setText"> </span> */}
                                    <span className='setCalendar'
                                        onClick={cpId?() => bd_router.push(this.props.history, '/product-calendar'):this.unloadTip}>更多</span>

                                </div>
                            </div>


                            <WeekView weekData={this.state.weekData}
                                sceneData={this.state.proCalendarData} onRef={(ref) => {
                                    this.weekview = ref
                                }} handerCurr={(currs) => this.handerCurr(currs)}
                                slideTo={this.state.slideTo} pageNo={this.state.pageNo}
                                pageSize={this.state.pageSize} day={this.state.day}
                                key={this.state.wkindex} dateTo={this.state.dateTo}
                                cpId={this.state.cpId}
                                curr={this.state.curr} />
                        </section>
                        <section className='productList'>
                            <div className='title'>
                                <div className='titleText'>产品列表</div>
                                <div className='more'
                                    onClick={cpId?() => bd_router.push(this.props.history, '/product-list'):this.unloadTip}>更多</div>
                            </div>
                            {cpId?
                                (
                                <div className='proItem'>
                                    <GoodsList parentProps={this.props} data={this.state.productListDataSource} />
                                </div>
                                ):
                                    (<UnloadBox/>)
                            }
                        </section>
                        {/*  客服 拖拽 */}
                        {/* <section className='callServer' id='callServer' style={{left:this.state.positionX+'px',top:this.state.positionY+'px'}} onTouchStart={ this.dragStart.bind(this)} onTouchMove={(e)=>{this.dragMove(e)}} onTouchEnd={(e)=>{this.dragEnd(e)}}   draggable={true}> */}
                            <div className='Services' id="Services" onClick={() => {
                                bd_router.push(this.props.history, "/contacts")
                            }}></div>
                            <div className='onLineSer' id="onLineSer" onClick={() => {
                                this.getOnlineSer()
                            }}>

                            </div>
                    </section>
                </section>
                {/* /客户弹出框 */}
                <Modal
                    visible={this.state.modal}
                    transparent
                    maskClosable={false}
                    closable={true}
                    maskClosable={false}
                    transparent={false}
                    animationType={'slide-down'}
                    className={'pop'}
                    onClose={this.onClose('modal')}
                    title="在线客服"
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div className='service-main'>
                        <object
                            data={`https://tgkf.csc108.com:8443/chatVisitor/mobile.html?codeKey=1&companyPk=8a6dfa386dcab402016dcd3bbde40000&channelPk=8a6dfa3b71f42ead0172099970e00000&userId=0865f7b59bb048bc89e3bb5e26815af7#/`}
                            type="text/html" className='services_box'></object>
                    </div>

                </Modal>
            </div>
        );
    }
}

export default Home
