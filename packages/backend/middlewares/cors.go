package middlewares

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"backend/utils"
)

func SetupCORS() gin.HandlerFunc {
	if utils.IsLocalDev() {
			return cors.Default()
	} else {
			// Restrict origins in production
			// TODO config before release
			config := cors.Config{
					AllowOrigins:     []string{"https://your-production-ui.com"},
					AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
					AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
					ExposeHeaders:    []string{"Content-Length"},
					AllowCredentials: true,
					MaxAge:           12 * time.Hour,
			}
			return cors.New(config)
	}
}
