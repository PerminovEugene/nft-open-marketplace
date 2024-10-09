package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func IsLocalDev() bool {
	goEnv := os.Getenv("GO_ENV")
	return goEnv != "PRODUCTION"
}

func SetupEnv() {
	err := godotenv.Load()
  if err != nil {
    log.Fatal(".env file is not found")
  }
}