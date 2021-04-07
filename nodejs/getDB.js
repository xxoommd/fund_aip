const https = require('https');
const querystring = require('querystring');
const xml2js = require('xml2js');

const { Fund, FundData } = require('./base/fund');

const favorite = require('../db/meta/fav.json');

// https://fundf10.eastmoney.com/F10DataApi.aspx?type=lsjz&code=005774&page=1&sdate=1970-01-01&edate=2021-03-22&per=20
function doRequest(httpOptions) {
    return new Promise((resolve, rejecet) => {
        https.request(httpOptions, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('error', err => rejecet(err));
            res.on('end', () => resolve(body));
        }).end()
    })
}

const allFunds = [];
for (let fid in favorite) {
    allFunds.push(new Fund(fid, favorite[fid]))
}

if (allFunds.length == 0) {
    console.log('No favorite fund');
    process.exit(0);
}

let fund = allFunds[0]; // let fund = new Fund('009865', '招商景气优选股票C')
let ctrls = {
    index: 0,
    page: 1,
    maxPage: 1,
    sdate: fund.latestDate(),
    edate: getNowDate()
}

const requestData = () => {
    let queryStr = querystring.stringify({
        type: "lsjz",
        code: fund.id,
        page: ctrls.page,
        sdate: ctrls.sdate,
        edate: ctrls.edate,
        per: 20, // max 20
    });
    let options = {
        hostname: 'fundf10.eastmoney.com',
        path: `/F10DataApi.aspx?${queryStr}`,
        method: 'GET'
    }

    process.stdout.write(`[${fund.id}-${fund.name}] checking...`)
    let logStr = `[${fund.id}-${fund.name}] updating... [${ctrls.page}/${ctrls.maxPage}]`
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    process.stdout.write(logStr);
    doRequest(options).then(body => {
        try {
            eval(body)
            if (ctrls.maxPage != apidata.pages) {
                ctrls.maxPage = apidata.pages;
            }

            xml2js.parseString(apidata.content, (err, result) => {
                if (err) {
                    console.error('parse xml2js error:', err)
                    return
                }

                let tbody = result.table.tbody
                for (let i in tbody) {
                    let tr = tbody[i]
                    for (let j in tr) {
                        for (let l in tr[j]) {
                            let item = tr[j][l].td;
                            if (item.length < 3) {
                                console.error('invalid item:', item)
                            } else {
                                fund.addData(new FundData({ nav: item[1]["_"], accnav: item[2]["_"], date: item[0] }))
                            }
                        }
                    }
                }
            })

            ctrls.page++;
            if (ctrls.page <= ctrls.maxPage) {
                requestData();
            } else {
                fund.sortHistoryData();
                console.log('')
                fund.saveData().then(() => {
                    console.log(`[${fund.id}-${fund.name}] done\n`)
                    ctrls.index++;
                    if (ctrls.index < allFunds.length) {
                        fund = allFunds[ctrls.index]
                        ctrls.page = 1;
                        ctrls.maxPage = 1;
                        ctrls.sdate = fund.latestDate();
                        requestData();
                    } else {
                        console.log('\n[Done] 😀')
                        process.exit(0);
                    }
                });
            }
        } catch (e) {
            console.error('Err:', e)
        }
    }, err => {
        console.error('Err:', err)
    });
}

console.log('[Start] 😀\n')
// setTimeout(requestData, 1500);
requestData();


// 获取特定格式的当前日期: YYYY-MM-DD
function getNowDate() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}