package fund

import (
	"fmt"
)

// AIPType enum
type AIPType int8

// All AIPType constant
const (
	AIPTypeStart  AIPType = 0
	AIPTypePerDay         = iota + AIPTypeStart
	AIPTypePerWeek
	AIPTypePer2Week
	AIPTypePerMonth
	AIPTypeBuyOnce
	AIPTypeEnd
)

// Strategy map
type Strategy map[AIPType]float64

// AIP aka: automatic investment plan
type AIP struct {
	Strategy    AIPType `json:"strategy"`
	Invest      float64 `json:"invest"`
	Share       float64 `json:"share"`
	NumOfCycle  int     `json:"num_of_cycle"`
	InvestAll   float64 `json:"invest_all"`
	AllAssets   float64 `json:"all_assets"`
	Income      float64 `json:"income"`
	GeneralRate float64 `json:"general_rate"`
	AnnualRate  float64 `json:"annual_rate"`
}

func (t AIPType) String() string {
	return fmt.Sprint(int8(t))
}

func (t AIPType) stepDays() int64 {
	switch t {
	case AIPTypePerDay:
		return 1
	case AIPTypePerWeek:
		return 7
	case AIPTypePer2Week:
		return 14
	case AIPTypePerMonth:
		return 30
	default:
		return 0
	}
}
