/*
 * 服务日历 - 定制日历
 * - 周视图
 * - 月视图
 * */

import bd_utils from "./bd_utils";

const now = new Date();

export default {
    /*获取当前日期前一年|后三月的日期数据*/
    getMonthBetween: function (){
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let date = now.getDate();
        let min = 0;
        // 闰年
        if ((year%4) === 0 && (year%100) !== 0 && month === 2 && date === 29 ) {
            min = (year-1) + '/' + month + '/' + 28;
        } else {
            min = (year-1) + '/' + month + '/' + date;
        }
        // 10+ 月
        if (month+3>12) {
            year += 1;
            month = month + 3 - 12;
        } else {
            month = month + 3
        }
        let max = year + '/' + month + '/' + date;

        let minDate = new Date(min);
        let maxDate = new Date(max);

        let dateArr = [];
        for (let ts = minDate.getTime(); ts <= maxDate.getTime(); ts += 60*60*24*1000) {
            let ress = {};
            let day = new Date(ts);
            ress.week = this.dateWeek(day.getDay());
            ress.y_m_d = day.getFullYear()+'/'+(day.getMonth()+1)+'/'+day.getDate()
            if (this.today() === ts){
                ress.date = '今';
            } else {
                ress.date = day.getDate();
            }
            dateArr.push(ress)
        }
        return dateArr;
    },

    today:function () {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth()+1;
        let date = now.getDate();
        return new Date(year+'/'+month+'/'+date).getTime();
    },

    dateWeek:function (date){
        let week;
        if(date===0) week="日";
        if(date===1) week="一";
        if(date===2) week="二";
        if(date===3) week="三";
        if(date===4) week="四";
        if(date===5) week="五";
        if(date===6) week="六";
        return week;
    },
    formatZero:function(num){
        if (num<10) return '0'+num;
        else return ''+num;
    },
    /*判断是否闰年*/
    isLeapYear(){
        let year = new Date(now).getFullYear();
        if(year%4==0&&year%100!=0||year%400==0) return true
        else return false
    },
    /*获取当前年月中月的第一天和最后一天*/
    getFirstAndLastMonthDay:function(yearmonth){
        if (bd_utils.isEmpty(yearmonth)) return ['','']
        let year = yearmonth.substr(0,4);
        let month = yearmonth.substr(5,2)
        let dateArr = [];
        let firstdate = year + '-' + month + '-01';
        let  day = new Date(year,month,0);
        let lastdate = year + '-' + month + '-' + day.getDate();
        dateArr = [firstdate,lastdate]
        return dateArr;
    },
    /*获取当前日期的下一天*/
    nextDate(date) {
        if (bd_utils.isEmpty(date)) return '';
        date = new Date(date);
        date = +date + 1000 * 60 * 60 * 24;
        date = new Date(date);
        return date.getFullYear() + "-" + this.formatZero((date.getMonth() + 1)) + "-" + this.formatZero(date.getDate());
    }
}
