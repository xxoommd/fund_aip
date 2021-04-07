package service

import (
	"fmt"
	"net/http"
	"papa/date"
	"strconv"

	"github.com/gin-gonic/gin"
)

type generalResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Desc    string      `json:"desc"`
}

// StartHTTP method
func StartHTTP(addr string) {
	r := gin.Default()
	r.StaticFile("/umi.js", "./web/dist/umi.js")
	r.StaticFile("/umi.css", "./web/dist/umi.css")

	r.LoadHTMLFiles("./web/dist/index.html")

	r.GET("/", getIndex)
	r.GET("/api/funds", getFundList)
	r.GET("/api/funds/:fundID/aip", getFundAIP)

	r.Run(addr)
}

func getIndex(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
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
	fundID := c.Param("fundID")
	totalInvest, _ := strconv.ParseFloat(c.DefaultQuery("totalInvest", "100000"), 64)
	sdate := c.DefaultQuery("sdate", "1970-01-01")
	edate := c.DefaultQuery("edate", date.Now().String())

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
