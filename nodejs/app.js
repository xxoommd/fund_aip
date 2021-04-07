const { Fund } = require('./base/fund');
const { nextDay, nextMonth, dateLess, getNowDate } = require('./base/dateutil');

// const myFund = new Fund('400015', '东方新能源汽车混合');
// const myFund = new Fund('001171', '工银养老产业股票');
const myFund = new Fund('118001', '易方达亚洲精选股票');
// console.log(myFund)

// var i = 0;  // dots counter
// setInterval(function () {
//     process.stdout.clearLine();  // clear current text
//     process.stdout.cursorTo(0);  // move cursor to beginning of line
//     i = (i + 1) % 4;
//     var dots = new Array(i + 1).join(".");
//     process.stdout.write("Waiting" + dots);  // write text
// }, 300);

// 定投策略
// - 每月
// - 每两周
// - 每周
// - 每日
// 定投金额
// 定投时长

// 总投入
// 当前总资产
// 总收益率
// 年化收益率

let startDate = "2011-01-01";
let endDate = getNowDate();
let invest = 2000;

const log = {
    fund: myFund.toInfo(),
    start: startDate,
    end: endDate,
    invest: `¥${invest}/月`
}

// console.log(`--- [${startDate} to ${endDate}] ${invest}/month`)
console.log(log)

let nextDate = startDate;

let totalInvest = 0;
let share = 0; // 份额
let endNav = 0;

while(dateLess(nextDate, endDate)) {
    // console.log('- date:', nextDate);
    
    let data = myFund.findData(nextDate);
    if (data != null) {
        share += invest / data.nav;
        totalInvest += invest;
        endNav = data.nav;
    }

    nextDate = nextMonth(nextDate);
}

const output = {
    总投入: `¥${totalInvest}`,
    总资产: `¥${(share*endNav).toFixed(3)}`,
    收益率: `¥${(share * endNav / totalInvest * 100).toFixed(3)}%`,
    份额: `${share.toFixed(3)}`,
    nav: endNav
}

console.log(output)