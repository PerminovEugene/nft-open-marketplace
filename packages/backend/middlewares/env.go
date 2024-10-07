package middlewares

import (
	"log"

	"github.com/joho/godotenv"
)

func SetupEnv() {
	err := godotenv.Load()
  if err != nil {
    log.Fatal(".env file is not found")
  }
}