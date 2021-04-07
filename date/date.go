package date

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

const dateFormat = "2006-01-02"

var monthDays = map[int64]int64{
	1:  31,
	2:  28,
	3:  31,
	4:  30,
	5:  31,
	6:  30,
	7:  31,
	8:  31,
	9:  30,
	10: 31,
	11: 30,
	12: 31,
}

// Date format: "YYYY-MM-DD"
type Date int64

// IsLeapYear 判断年份year是否是闰年
func IsLeapYear(year int64) bool {
	if year%100 == 0 {
		return (year % 400) == 0
	}

	return (year % 4) == 0
}

// MonthDays 特定月份的天数
func MonthDays(year, month int64) int64 {
	if month == 2 && IsLeapYear(year) {
		return 29
	}

	d := monthDays[month]
	return d
}

// New method
//  - year: x
//  - month: 1~12
//  - day: 1-31
func New(str string) Date {
	tmp := strings.Join(strings.Split(str, "-"), "")
	d, _ := strconv.ParseInt(tmp, 0, 64)
	return Date(d)
}

// Now method
func Now() Date {
	return New(time.Now().Format(dateFormat))
}

// Year method
func (date Date) Year() int64 {
	d := int64(date)
	return d / 10000
}

// Month method
func (date Date) Month() int64 {
	d := int64(date)
	return (d - date.Year()*10000) / 100
}

// Day method
func (date Date) Day() int64 {
	d := int64(date)
	return (d - date.Year()*10000 - date.Month()*100)
}

func (date Date) String() string {
	return fmt.Sprintf("%04d-%02d-%02d", date.Year(), date.Month(), date.Day())
}

// IncreaseDay method
func (date Date) IncreaseDay(days int64) Date {
	year := date.Year()
	month := date.Month()
	day := date.Month()

	nextDay := day + days
	monthDays := MonthDays(date.Year(), date.Month())
	for nextDay > monthDays {
		month++
		if month > 12 {
			year++
			month = 1
		}
		nextDay -= monthDays
	}

	return Date(year*10000 + month*100 + nextDay)
}

// ExactYearDistance method
func (date Date) ExactYearDistance(fromDate Date) float64 {
	disDays := (date.Year() - fromDate.Year()) * 365
	disDays += (date.Month() - fromDate.Month()) * 30
	disDays += (date.Day() - fromDate.Day())
	return float64(disDays) / 365
}
