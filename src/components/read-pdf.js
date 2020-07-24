import React, {Component} from "react";
import Pdfh5 from "pdfh5";
import "../css/pdfh5.less"

export default class PdfLoader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pdfh5: null
        }
    }

    componentDidMount() {
        //实例化
        this.setState({
            pdfh5: new Pdfh5("#pdfh5", {
                pdfurl: this.props.url,
                renderType: 'svg',
                zoomEnable: true,
                scrollEnable: true,
                lazy: true
            })
        }, () => {
            //监听完成事件
            this.state.pdfh5.on("complete", function (status, msg, time) {
                console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
            });
        });
    }

    render() {
        return (
            <div id="pdfh5" className="pdfh5"></div>
        );
    }
}
