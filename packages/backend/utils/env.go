package utils

import "os"

func IsLocalDev() bool {
	goEnv := os.Getenv("GO_ENV")
	return goEnv != "PRODUCTION"
}