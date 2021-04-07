import React from 'react';
import { PageHeader, Button, Descriptions, Table, Menu, Input, InputNumber, Spin, DatePicker, Space } from 'antd';
import moment from 'moment';
import './index.less';

const { RangePicker } = DatePicker;
const { SubMenu } = Menu;

const dateFormat = 'YYYY-MM-DD';

enum AIPType {
  PerDay = 1,
  PerWeek,
  Per2Week,
  PerMonth,
  BuyOnce,
}

function getAIPTypeName(aipType: AIPType): string {
  switch (aipType) {
    case AIPType.PerDay:
      return "每日";
    case AIPType.PerWeek:
      return "每周";
    case AIPType.Per2Week:
      return "每两周";
    case AIPType.PerMonth:
      return "每月";
    case AIPType.BuyOnce:
      return "一次性投入";
    default:
      return "-";
  }
}

interface StrategiesType {
  [AIPType.PerDay]: number
  [AIPType.PerWeek]: number
  [AIPType.Per2Week]: number
  [AIPType.PerMonth]: number
  [AIPType.BuyOnce]: number
}

interface StrategyRecord {
  strategy: AIPType,
  invest: number,
  num_of_cycle: number,
  invest_all: number,
  all_assets: number,
  income: number,
  general_rate: number,
  annual_rate: number
}

const cashLabel = (val: number, up: boolean) => {
  const color = up ? 'green' : 'red';
  return <label style={{ color }}>{formatMoneyRMB(val)}</label>
}

const rateLabel = (val: number) => {
  const color = val > 0 ? 'green' : 'red';
  let str = `${(val * 100).toFixed(2)}%`;
  if (val > 0) {
    str = '+'+str
  }
  return <label style={{ color }}>{str}</label>
}

const disabledDate = (date: moment.Moment) => {
  let dat = moment(date);
  let now = moment(new Date());
  return dat.unix() > now.unix();
}

const formatMoneyRMB = (money: number | undefined): string => {
  if (!money || money === 0) {
    return '$0.00'
  }

  let [integer, dot] = `${money.toFixed(2)}`.split('.');
  if (!dot) {
    dot = '00';
  }
  return `¥${integer}.${dot}`;
}

const inputMoneyFormatter = (money: number | undefined): string => {
  money = money ? +money : 0;
  return formatMoneyRMB(+money)
}


function formatDataSource(dataSource: any): any {
  return dataSource.map((data: any, index: number) => {
    data.key = index;
    return data;
  }).sort((a: any, b: any) => a.strategy - b.strategy);
}

function requestFundAIP(fundID: string, totalInvest: number, sdate: string, edate: string): Promise<any> {
  let query = `totalInvest=${totalInvest}&sdate=${sdate}&edate=${edate}`;
  let url = `api/funds/${fundID}/aip?${query}`;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(body => body.json(), reject)
      .then(res => {
        if (res.success && res.data && res.data instanceof Array && res.data.length > 0) {
          let dataSource = formatDataSource(res.data);
          resolve(dataSource);
        }
      }, reject);
  })
}

class fund {
  id: string;
  name: string;
  sdate: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.sdate = data.sdate;
  }

  toString() {
    return `${this.id} - ${this.name}`;
  }
}

class IndexPage extends React.Component {
  state = {
    loading: true,
    selected: '',
    fundMap: new Map<string, fund>(),
    fundList: new Array(),
    dataSource: new Array(),
    totalInvest: 100000,
    sdate: '1970-01-01',
    edate: moment().format(dateFormat),
  }

  requestFund = (fundID: string, sdate: string, edate: string) => {
    let { totalInvest } = this.state;
    requestFundAIP(fundID, totalInvest, sdate, edate).then(data => {
      this.setState({ dataSource: data });
    })
  }

  handleSelect = (e: any) => {
    let { selected, sdate, edate, fundMap } = this.state;
    if (selected == e.key) {
      return
    }

    this.requestFund(e.key, sdate, edate);
    let f = fundMap.get(e.key);
    this.setState({ selected: e.key });
  }

  handleCalc = () => {
    let { selected, sdate, edate } = this.state;
    this.requestFund(selected, sdate, edate);
  }

  componentDidMount() {
    let { fundList, selected, dataSource } = this.state;
    if (fundList.length === 0) {
      fetch('api/funds').then(res => res.json()).then(res1 => {
        if (res1 && res1.success && res1.data && res1.data.funds) {
          let fundMap = new Map<string, fund>();
          Object.entries(res1.data.funds).forEach(([key, val]) => {
            let newFund = new fund(val)
            fundList.push(newFund)
            fundMap.set(key, newFund);
          })
          fundList.sort((a: fund, b: fund) => parseInt(a.id) - parseInt(b.id))
          if (selected == '') {
            selected = fundList[0].id;
          }
          let sdate = fundList[0].sdate;
          this.setState({ sdate, selected, fundList, fundMap });

          if (dataSource.length == 0) {
            let { edate } = this.state;
            this.requestFund(selected, sdate, edate);
          }
        }
      });
    }
  }

  render() {
    const { sdate, edate, selected, fundList, fundMap, dataSource } = this.state;
    let selectedFund = fundMap.get(selected)
    // console.log('----- sdate:', sdate)


    const numberInputOnChange = (key: AIPType, val: number) => {
      // let { selected } = this.state;
      // strategies[key] = val;
      // this.setState({ strategies })
      // this.requestFund(selected);
    }

    const numberInputOnPressEnter = (e: any) => {
      let { selected, sdate, edate } = this.state;
      this.requestFund(selected, sdate, edate);
    }

    const numberInput = (key: AIPType, val: number) => {
      return (<InputNumber
        bordered={false}
        min={1}
        max={99999999}
        prefix="人民币"
        defaultValue={val}
        formatter={inputMoneyFormatter}
        style={{ width: '100%' }}
        onChange={v => { numberInputOnChange(key, v) }}
        onPressEnter={numberInputOnPressEnter}
      >
      </InputNumber>)
    }

    const onCalendarChange = (dates: any, datesStr: [string, string]) => {
      if (datesStr.length < 2) {
        return
      }

      // let [d1, d2] = [dates[0].format(dateFormat), dates[1].format(dateFormat)]
      let [d1, d2] = datesStr;

      let { sdate, edate, selected } = this.state;
      sdate = d1;
      edate = d2;
      this.setState({ sdate, edate });
      this.requestFund(selected, sdate, edate);
    }

    const columns = [
      {
        title: '投资策略',
        dataIndex: 'strategy',
        key: 'strategy',
        render: (v: AIPType) => `${getAIPTypeName(v)}`
      },
      {
        title: '每期投入',
        dataIndex: 'invest',
        key: 'invest',
        // render: (val: number, record: StrategyRecord) => numberInput(record.strategy, val),
        render: (val: number, record: StrategyRecord) => cashLabel(val, true),
      },
      {
        title: '投资期数',
        dataIndex: 'num_of_cycle',
        key: 'num_of_cycle',
        render: (val: number) => `${val}期`
      },
      {
        title: '总投入',
        dataIndex: 'invest_all',
        key: 'invest_all',
        render: (val: number) => <label style={{ color: '#539ff7' }}>{formatMoneyRMB(val)}</label>
      },
      {
        title: '盈利',
        dataIndex: 'income',
        key: 'income',
        render: (val: number) => <label style={{ color: '#539ff7' }}>{formatMoneyRMB(val)}</label>
      },
      {
        title: '总资产',
        dataIndex: 'all_assets',
        key: 'all_assets',
        render: (val: number, record: StrategyRecord) => {
          return cashLabel(val, record.general_rate > 0)
        }
      },
      {
        title: '总收益率',
        dataIndex: 'general_rate',
        key: 'general_rate',
        render: (val: number) => {
          return rateLabel(val)
        }
      },
      {
        title: '平均年化',
        dataIndex: 'annual_rate',
        key: 'annual_rate',
        render: (val: number) => {
          return rateLabel(val)
        }
      },
    ];

    return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          onBack={() => { location.href = "/" }}
          title="基金定投计(da)算(lian)器"
          subTitle="papapa"
          extra={[
            <Button key="1" type="primary" onClick={() => this.handleCalc()}>计算</Button>
          ]}
        >
          <Descriptions key="000" size="small" column={1} bordered>

            <Descriptions.Item label="选择基金" labelStyle={{ width: '10em' }}>
              <Menu mode="horizontal" onClick={this.handleSelect} selectedKeys={[selected]}>
                <SubMenu key="selectFund" title={selectedFund?.toString()}>
                  <Menu.ItemGroup>
                    {
                      fundList.map((item: fund) => (
                        <Menu.Item key={item.id} >
                          <a>{item.toString()}</a>
                        </Menu.Item>
                      ))
                    }
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
            </Descriptions.Item>

            <Descriptions.Item label="投资周期" labelStyle={{ width: '10em' }}>
              <RangePicker
                allowClear={false}
                bordered={false}
                picker="date"
                value={[moment(sdate, dateFormat), moment(edate, dateFormat)]}
                disabledDate={disabledDate}
                onChange={onCalendarChange}
              />
            </Descriptions.Item>

          </Descriptions>
        </PageHeader>

        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
        >;
        </Table>
      </div>
    );
  }
}


export default IndexPage;