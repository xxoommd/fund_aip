package fund

import (
	"fmt"
	"math"
	"papa/date"
	"strconv"
)

// NavData struct
type NavData struct {
	Date   string `json:"date"`
	Nav    string `json:"nav"`
	Accnav string `json:"accnav"`

	nav, accnav float64
	date        date.Date
}

// Fund struct
type Fund struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	HistoryData []*NavData `json:"historyData"`

	sdate, edate date.Date
}

func (data *NavData) init() {
	data.nav, _ = strconv.ParseFloat(data.Nav, 10)
	data.accnav, _ = strconv.ParseFloat(data.Accnav, 10)
	data.date = date.New(data.Date)
}

// Init initialize fund data
func (f *Fund) Init() {
	if len(f.HistoryData) > 0 {
		f.sdate = date.New(f.HistoryData[0].Date)
		f.edate = date.New(f.HistoryData[len(f.HistoryData)-1].Date)
	} else {
		f.sdate = date.New("1970-01-01")
		f.edate = date.Now()
	}

	for _, data := range f.HistoryData {
		data.init()
	}
}

func (f *Fund) String() string {
	var (
		firstData, lastData string
	)
	if len(f.HistoryData) > 0 {
		firstData = f.HistoryData[0].Date
		lastData = f.HistoryData[len(f.HistoryData)-1].Date
	}
	return fmt.Sprintf("%s: %s [%s ~ %s]", f.ID, f.Name, firstData, lastData)
}

// ToFav to favorite list
func (f *Fund) ToFav() map[string]string {
	return map[string]string{
		"id":    f.ID,
		"name":  f.Name,
		"sdate": f.sdate.String(),
	}
}

// FirstNavData method
func (f *Fund) FirstNavData() *NavData {
	if l := len(f.HistoryData); l > 0 {
		return f.HistoryData[0]
	}
	return nil
}

// CurrentNav 最新的nav
func (f *Fund) CurrentNav() float64 {
	if l := len(f.HistoryData); l > 0 {
		return f.HistoryData[l-1].nav
	}
	return 0
}

// CurrentAccNav method
func (f *Fund) CurrentAccNav() float64 {
	if l := len(f.HistoryData); l > 0 {
		return f.HistoryData[l-1].nav
	}
	return 0
}

// CalculateAllPlans 计算所有方案
func (f *Fund) CalculateAllPlans(invest float64, sdate, edate string) []*AIP {
	result := []*AIP{}
	for sta := AIPTypeStart; sta < AIPTypeEnd; sta++ {
		r := f.calcAIP(sta, invest, sdate, edate)
		if r != nil {
			result = append(result, r)
		}
	}

	return result
}

// invest: 总投入
func (f *Fund) calcAIP(aipType AIPType, totalInvest float64, sdate, edate string) *AIP {
	startDate := date.New(sdate)
	endDate := date.New(edate)
	switch aipType {
	case AIPTypePerDay, AIPTypePerWeek, AIPTypePer2Week, AIPTypePerMonth:
		var (
			stepDays = aipType.stepDays()
			idate    = startDate
		)

		aip := &AIP{
			Strategy:  aipType,
			InvestAll: totalInvest,
		}

		investHis := []*NavData{}

		for _, data := range f.HistoryData {
			if idate >= endDate || idate >= date.Now() {
				break
			}

			if idate <= data.date {
				investHis = append(investHis, data)
				if idate == data.date {
					idate = idate.IncreaseDay(stepDays)
				} else {
					idate = data.date.IncreaseDay(stepDays)
				}
			}
		}

		// fmt.Printf("---- aipType:%v invest his: %v totalInvest:%v \n", aipType, len(investHis), totalInvest)

		if l := len(investHis); l > 0 {
			sum := totalInvest
			aip.Invest = totalInvest / float64(len(investHis))
			for _, data := range investHis {
				if sum <= 0 {
					break
				}
				currInvest := aip.Invest
				if currInvest > sum {
					currInvest = sum
				}
				sum -= currInvest
				aip.Share += currInvest / data.accnav
				aip.NumOfCycle++
			}
		}

		aip.AllAssets = f.CurrentAccNav() * aip.Share
		aip.Income = aip.AllAssets - aip.InvestAll
		if aip.InvestAll > 0 {
			aip.GeneralRate = aip.Income / aip.InvestAll
		}

		totalYear := endDate.ExactYearDistance(startDate)
		// fmt.Printf("---------- totalYear:%v \n", totalYear)
		aip.AnnualRate = math.Pow(aip.AllAssets/aip.InvestAll, 1.0/totalYear) - 1

		return aip
	case AIPTypeBuyOnce:
		idate := date.New(sdate)
		if firstDate := f.FirstNavData(); firstDate != nil && idate < firstDate.date {
			idate = firstDate.date
		}

		aip := &AIP{
			Strategy:   aipType,
			Invest:     totalInvest,
			InvestAll:  totalInvest,
			NumOfCycle: 1,
		}

		for _, data := range f.HistoryData {
			if data.date >= idate {
				aip.Share = totalInvest / data.nav
				break
			}
		}

		aip.AllAssets = f.CurrentNav() * aip.Share
		aip.Income = aip.AllAssets - aip.InvestAll
		if aip.InvestAll > 0 {
			aip.GeneralRate = (aip.Income / aip.InvestAll)
		}

		totalYear := endDate.ExactYearDistance(startDate)
		fmt.Printf("---------- totalYear:%v \n", totalYear)
		aip.AnnualRate = math.Pow(aip.AllAssets/aip.InvestAll, 1.0/totalYear) - 1

		return aip
	default:
		return nil
	}
}
