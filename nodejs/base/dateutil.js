const month_days = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
};

function getMonthDays(y, m) {
    if (m == 2 && (isLeapYear(y))) {
        return 29
    }

    return month_days[m]
}

function isLeapYear(y) {
    if (y % 100 == 0) {
        return (y % 400) == 0
    }

    return (y % 4) == 0
}

function nextDay(date) {
    let tmp = date.split('-')
    if (tmp.length < 3) {
        return ''
    }
    let [y,m,d] = tmp;

    d++;
    let monthDays = getMonthDays(+y, +m);
    if (+d > monthDays) {
        m++
        d = 1;
    }
    return dateString(y, m, d)
}

function dateString(y,m,d) {
    return `${+y}-${m >= 10 ? m : `0${+m}`}-${d >= 10 ? d : `0${+d}`}`
}

function nextMonth(dat) {
    let tmp = dat.split('-')
    if (tmp.length < 3) {
        return ''
    }

    let [y, m, d] = tmp;
    m++;
    if (m > 12) {
        y++;
        m = 1;
    }

    return dateString(y,m,d)
}

function dateLess(date1, date2) {
    const dateNum = dat => {
        let tmp = dat.split('-')
        return +tmp[0] * 10000 + (+tmp[1] * 100) + (+tmp[2])
    }

    let num1 = dateNum(date1);
    let num2 = dateNum(date2);
    return num1 <= num2;
}

// 升序或降序排列 
//  - date format: YYYY-MM-DD
//  - asc: 1升序, 0降序
function dateCompare(date1, date2, asc) {
    let num1 = dateNum(date1);
    let num2 = dateNum(date2);
    if (asc > 0) {
        return num1 - num2;
    } else {
        return num2 - num1;
    }
}

function dateNum(dat) {
    let tmp = dat.split('-')
    return +tmp[0] * 10000 + (+tmp[1] * 100) + (+tmp[2])
}

// 获取特定格式的当前日期: YYYY-MM-DD
function getNowDate() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

module.exports = {
    nextDay,
    nextMonth,
    dateLess,
    dateCompare,
    dateNum,
    getNowDate
}