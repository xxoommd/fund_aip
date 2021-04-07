const path = require('path');
const fs = require('fs');
const { dateCompare, dateNum } = require('./dateutil');

const DB_BASE_PATH = "../db";

class FundData {
    constructor(params) {
        this.date = params.date;
        this.nav = params.nav;
        this.accnav = params.accnav;
    }
}

class Fund {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.historyData = [];
        this._dirty = false;
        this.loadData();
    }

    dbPath() {
        return path.resolve(DB_BASE_PATH, `${this.id}_${this.name}.json`)
    }

    addData(data) {
        for (let _data of this.historyData) {
            if (data.date == _data.date) {
                return
            }
        }
        this.historyData.push(data);
    }

    findData(dat) {
        if (!this.historyData || this.historyData.length == 0) {
            return null
        }

        for (let data of this.historyData) {
            if (dateNum(dat) == dateNum(data.date)) {
                return data
            }
        }

        return null
    }

    sortHistoryData() {
        if (this.historyData && this.historyData.length > 0) {
            this.historyData.sort((d1, d2) => {
                return dateCompare(d1.date, d2.date, 1) // 升序排列
            })
        }
    }

    loadData() {
        let filepath = this.dbPath();
        if (fs.existsSync(filepath)) {
            try {
                let content = require(filepath);
                if (content.historyData && content.historyData.length > 0) {
                    for (let data of content.historyData) {
                        this.addData(new FundData(data));
                    }
                    this.sortHistoryData();
                }
            } catch(e) {
                console.error('ERR:', e)
            }
        } else {
            // console.warn(`  DB FILE [${filepath}] not exist.`)
        }
    }

    saveData() {
        return new Promise((resolve, reject) => {
            let filepath = this.dbPath();
            let content = this.toJSON();

            fs.writeFile(filepath, content, err => {
                if (err) {
                    console.error(` WRITE FILE [${filepath}]ERR:`, err);
                    reject();
                    return;
                }

                // console.log(`   WRITE FILE [${filepath}] SUCCESS`);
                resolve();
            })
        })
    }

    firstDate() {
        if (this.historyData && this.historyData.length > 0) {
            return this.historyData[0].date;
        }
        return "1970-01-01";
    }

    latestDate() {
        if (this.historyData && this.historyData.length > 0) {
            return this.historyData[this.historyData.length - 1].date;
        }
        return "1970-01-01";
    }

    toJSON() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            historyData: this.historyData
        }, null, 2);
    }

    toInfo() {
        return `${this.id} - ${this.name}`
    }
}

module.exports = { Fund, FundData };