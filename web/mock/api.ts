export default {
    // 支持值为 Object 和 Array
    'GET /api/funds': {
        success: true,
        data: {
            funds: {
                "400015": {
                    id: "400015",
                    name: "东方新能源汽车混合",
                    sdate: "2011-01-01",
                },
                "005668": {
                    id: "005668",
                    name: "融通新能源汽车主题精选混合A",
                    sdate: "2012-01-01"
                },
                "160632": {
                    id: '160632',
                    name: "鹏华中证酒指数型证券投资基金(LOF)",
                    sdate: "2013-01-01"
                }
            }
        }
    },

    'GET /api/funds/005668/aip': {
        success: true,
        data: [{
            strategy: 2,
            invest: 2000,
            num_of_cycle: 68,
            invest_all: 134000,
            all_assets: 11196038.2743243,
            income: 1234567890,
            general_rate: 1.885,
            annual_rate: 0.254
        },
        {
            strategy: 1,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.333424324,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        },
        {
            strategy: 3,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.33134243,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        },
        {
            strategy: 4,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.334236634,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        },
        {
            strategy: 5,
            invest: 10000,
            num_of_cycle: 1,
            invest_all: 1168000,
            all_assets: 1128324.33,
            income: -12367890,
            general_rate: -0.449,
            annual_rate: -0.21
        },]
    },

    'GET /api/funds/400015/aip': {
        success: true,
        data: [{
            strategy: 2,
            invest: 2000,
            num_of_cycle: 19,
            invest_all: 18000,
            all_assets: 116038.27,
            income: 12347890,
            general_rate: 1.885,
            annual_rate: 0.254
        },
        {
            strategy: 1,
            invest: 1500,
            num_of_cycle: 76,
            invest_all: 1112000,
            all_assets: 14728324.33,
            income: -127890,
            general_rate: -0.25349,
            annual_rate: -0.0521
        },
        {
            strategy: 3,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.33,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        },
        {
            strategy: 4,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.33,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        }, {
            strategy: 5,
            invest: 10000,
            num_of_cycle: 1,
            invest_all: 1168000,
            all_assets: 1128324.33,
            income: -12367890,
            general_rate: -0.449,
            annual_rate: -0.21
        },]
    },

    'GET /api/funds/160632/aip': {
        success: true,
        data: [{
            strategy: 2,
            invest: 2000,
            num_of_cycle: 33,
            invest_all: 168000,
            all_assets: 96038.27,
            income: 67890,
            general_rate: 2.885,
            annual_rate: 0.854
        },
        {
            strategy: 1,
            invest: 1500,
            num_of_cycle: 56,
            invest_all: 11168000,
            all_assets: 11128324.33,
            income: -1234567890,
            general_rate: -0.9649,
            annual_rate: -0.8521
        },
        {
            strategy: 3,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.33,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        },
        {
            strategy: 4,
            invest: 1500,
            num_of_cycle: 22,
            invest_all: 11168000,
            all_assets: 11128324.33,
            income: -1234567890,
            general_rate: -0.42549,
            annual_rate: -0.7521
        },
        {
            strategy: 5,
            invest: 10000,
            num_of_cycle: 1,
            invest_all: 1168000,
            all_assets: 1128324.33,
            income: -12367890,
            general_rate: -0.449,
            annual_rate: -0.21
        },]
    }
}