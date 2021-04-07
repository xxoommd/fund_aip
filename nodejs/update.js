const http = require('http');
const fs = require('fs');
const path = require('path');

function doRequest(httpOptions) {
    return new Promise((resolve, rejecet) => {
        http.request(httpOptions, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('error', err => rejecet(err));
            res.on('end', () => resolve(body));
        }).end()
    })
}

class FundBase {
    constructor([id, code, name, ftype, fullName]) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.ftype = ftype;
    }

    static create(args) {
        return new FundBase(args);
    }
}

function main() {
    let options = {
        hostname: "fund.eastmoney.com",
        path: `/js/fundcode_search.js`,
        method: 'GET'
    }

    doRequest(options).then(res => {
        eval(res);
        const fundArr = [];
        for (const fund of r) {
            fundArr.push(FundBase.create(fund));
        }
        console.log('=== Fund list len:', fundArr.length);
        fundArr.sort((a, b) => a.id - b.id);
        const jsonData = {
            update_time: parseInt(Date.now()/1000),
            funds: fundArr
        }
        const content = JSON.stringify(jsonData, null, 2);
        const filepath = path.join("./db", "000000_all.json");
        fs.writeFile(filepath, content, err => {
            if (err) {
                console.error(`Write file:${filepath} fail:`, err)
                return
            }

            console.log(`Write file:${filepath} success.`)
        })
    }, err => {
        console.error('Err:', err)
    })
}

main()