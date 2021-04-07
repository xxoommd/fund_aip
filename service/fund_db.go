package service

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"papa/fund"
	"path/filepath"
)

var (
	fundMap = map[string]*fund.Fund{}
)

// LoadFundsDB method
func LoadFundsDB() {
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
