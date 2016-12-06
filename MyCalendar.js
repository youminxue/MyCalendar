/**
 * Created by summer on 2016/12/6.
 */

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var mCalendar = (function(){
    var arrayWeek = ['Mon ','Tue ','Web ','Thu ','Fri ','Sat ','Sun '];
    var now = 0;
    var base = 0;
    var selectBlock = [];
    var arrayDay = [];
    var operate = true;
    var _this = null;
    var inited = false;
    var initUI = function(){
        $(".calendartime>p").text(formatDates(arrayDay[0],arrayDay[6]));
        for(var index = 1;index <= 7;index++)
        {
            $(".ca-content-header>div").eq(index).text(arrayWeek[index-1]+arrayDay[index-1].Format("MM/dd"));
        }
    };
    var initData = function(date){
        arrayDay = calculateNow(date);
        initUI();
        parseData(selectBlock);
    }
    var init = function(obj, head, data, canoperate){
        if(inited)
            return;
        inited = true;
        _this = obj;
        $(head).html('<div class="calendartime" style="position:relative; margin:0 auto;width: 286px;height: 60px; font-size:16px;text-align: center;line-height:60px;font-family: 微软雅黑 color:#38454F;"><div class="leftarrow"><i class="em1"></i><i class="em2"></i></div><p></p><div class="rightarrow"><i class="em1"></i><i class="em2"></i></div></div>');
        var doc = '<div class="ca-content"><div class="ca-content-header ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-content-body"><div class="ca-content-time"><div></div><div>8:00 am</div><div>9:00 am</div><div>10:00 am</div><div>11:00 am</div><div>12:00 am</div><div>13:00 pm</div><div>14:00 pm</div><div>15:00 pm</div><div>16:00 pm</div><div>17:00 pm</div><div>18:00 pm</div><div>19:00 pm</div><div>20:00 pm</div><div></div></div><div class="ca-content-content"><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div class="ca-cell"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>';
        $(_this).html(doc);
        selectBlock = data;
        if(canoperate != undefined){operate = canoperate;}
        base = new Date();
        now = new Date();
        initData(now);
        if(operate){
            $(".ca-content-content>.ca-cell>div").css("cursor","hand");
            $(".ca-content-content>.ca-cell>div").click(function(){
                $(this).toggleClass('disableblock');
                var h = $(this).parent(".ca-cell").find('div').index(this);
                var l = $(this).parents(".ca-content-content").find('.ca-cell').index($(this).parent(".ca-cell").get(0));
                var str = arrayDay[h].Format("yyyyMMdd")+(l+1);
                if(selectBlock.indexOf(str)==-1){
                    selectBlock.push(str);
                }else{
                    selectBlock.remove(str);
                }
            });
        }
        $('.calendartime>.leftarrow').click(function(){
            preWeek();
        })
        $('.calendartime>.rightarrow').click(function(){
            nextWeek();
        });
    };
    var formatDates = function (startD, endD){
        var format1 = "MM月 dd日";
        if(startD.getYear() != endD.getYear()){
            format1 += ",yyyy";
        }
        var format2 = "dd日,yyyy";
        if(startD.getMonth() != endD.getMonth())
            format2 = "MM月 "+format2;
        return startD.Format(format1)+" - "+endD.Format(format2);
    };

    var calculateNow = function (now){
        var day = now.getDay();
        if(day == 0){day = 7;}
        var nowWeekDate = [];
        var speed = 86400000;
        for(var index = 1; index <= 7; index++){
            nowWeekDate[index-1] = new Date(now.getTime()-(day-index)*speed);
        }
        return nowWeekDate;
    };

    var parseData = function (data){
        cleanData();
        var baseymd = base.Format("yyyyMMdd");
        for(var hang = 0;hang < 14;hang++)
        {
            for(var lie = 0;lie < 7 ;lie++){
                var nowymd = arrayDay[lie].Format("yyyyMMdd");
                if(nowymd == baseymd){
                    $($($(".ca-content-content>.ca-cell")[hang]).find('div')[lie]).addClass('nowdaycolor');
                }
                var str = nowymd+(hang+1);
                if(selectBlock.indexOf(str)!=-1){
                    $($($(".ca-content-content>.ca-cell")[hang]).find('div')[lie]).addClass('disableblock');
                }
            }
        }
    };

    var cleanData = function (){
        for(var hang = 0;hang < 14;hang++)
        {
            for(var lie = 0;lie < 7 ;lie++){
                $($($(".ca-content-content>.ca-cell")[hang]).find('div')[lie]).removeClass('disableblock');
                $($($(".ca-content-content>.ca-cell")[hang]).find('div')[lie]).removeClass('nowdaycolor');
            }
        }
    };

    var preWeek = function (){
        now = new Date(now.getTime()-604800000);
        initData(now);
    };

    var nextWeek = function (){
        now = new Date(now.getTime()+604800000);
        initData(now);
    }

    var getData = function(){
        return selectBlock;
    }

    return {
        init:init,
        cleanData:cleanData,
        preWeek:preWeek,
        nextWeek:nextWeek,
        getData:getData
    };
})();

$.fn.MyCalendar = function (head,data,canoperate) {
    mCalendar.init(this, head, data, canoperate);
    return mCalendar;
};