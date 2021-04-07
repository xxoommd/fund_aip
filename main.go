package main

import (
	"papa/service"
)

func main() {
	service.LoadFundsDB()
	service.StartHTTP("0.0.0.0:8888")
}
