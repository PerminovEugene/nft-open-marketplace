package main

import (
	"backend/routes"
	"backend/utils"
)

func main() {
	utils.SetupEnv()

	router := routes.SetupRouter()

	router.Run(":8080")
}
