package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"papa/fund"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	fundMap = map[string]*fund.Fund{}
)

func main() {
	readFundsDB()

	r := gin.Default()
	r.StaticFile("/umi.js", "./web/dist/umi.js")
	r.StaticFile("/umi.css", "./web/dist/umi.css")

	r.LoadHTMLFiles("./web/dist/index.html")

	r.GET("/", getIndex)
	r.GET("/api/funds", getFundList)
	r.GET("/api/funds/:fundID/aip", getFundAIP)

	r.Run("0.0.0.0:8080")
}

func getIndex(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

type generalResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Desc    string      `json:"desc"`
}

func getFundList(c *gin.Context) {
	fundList := make(map[string]interface{}, len(fundMap))
	for _, f := range fundMap {
		fundList[f.ID] = f.ToFav()
	}

	res := generalResponse{
		Success: true,
		Data: map[string]interface{}{
			"funds": fundList,
		},
	}

	c.JSON(200, res)
}

func getFundAIP(c *gin.Context) {
	// parseFloat64 := func(s string, def float64) float64 {
	// 	f, err := strconv.ParseFloat(s, 10)
	// 	if err != nil {
	// 		return def
	// 	}
	// 	return f
	// }

	fundID := c.Param("fundID")
	totalInvest, _ := strconv.ParseFloat(c.DefaultQuery("totalInvest", "100000"), 64)
	sdate := c.DefaultQuery("sdate", "1970-01-01")
	edate := c.DefaultQuery("edate", nowFormattedDate())

	// strategy := fund.Strategy{
	// 	fund.AIPTypePerDay:   parseFloat64(c.Query(fund.AIPTypePerDay.String()), 1000),
	// 	fund.AIPTypePerWeek:  parseFloat64(c.Query(fund.AIPTypePerWeek.String()), 1000),
	// 	fund.AIPTypePer2Week: parseFloat64(c.Query(fund.AIPTypePer2Week.String()), 1000),
	// 	fund.AIPTypePerMonth: parseFloat64(c.Query(fund.AIPTypePerMonth.String()), 1000),
	// 	fund.AIPTypeBuyOnce:  parseFloat64(c.Query(fund.AIPTypeBuyOnce.String()), 1000),
	// }

	// fmt.Printf("--- fundID:%s totalInvest:%v sdate:%s edate:%s ---\n", fundID, totalInvest, sdate, edate)
	// fmt.Printf("--- strategy: %+v\n", strategy)

	res := generalResponse{}

	afund, ok := fundMap[fundID]
	if !ok {
		res.Success = false
		res.Desc = fmt.Sprintf("fund:%s not found", fundID)
		c.JSON(200, res)
		return
	}

	result := afund.CalculateAllPlans(totalInvest, sdate, edate)
	res.Success = true
	res.Data = result
	res.Desc = "OK"
	c.JSON(200, res)
}

func readFundsDB() {
	files, err := ioutil.ReadDir("db")
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".json" {
			content, err := ioutil.ReadFile(filepath.Join("db", file.Name()))
			if err != nil {
				log.Fatal(err)
			}

			fund := &fund.Fund{}
			err = json.Unmarshal(content, fund)
			if err != nil {
				log.Fatal(err)
			}

			fund.Init()
			fundMap[fund.ID] = fund
		}
	}
}

func nowFormattedDate() string {
	return time.Now().Format("2006-01-02")
}
