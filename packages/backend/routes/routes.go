// internal/routes/routes.go
package routes

import (
	"backend/clients/pinata"
	"backend/handlers"
	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

func attachMiddlewares(router *gin.Engine) {
	router.Use(middlewares.SetupCORS())
}

func attachRoutes(router *gin.Engine) {

	pinataClient, err := pinata.NewPinataClient()
	if err != nil {
		panic("Failed to create Pinata client")
	}
	ipfsGroup := router.Group("/ipfs")
	ifpsHandler := handlers.NewIfpsHandler(pinataClient)
	{
		ipfsGroup.POST("/upload", ifpsHandler.IfpsPinImageAndMeta)
	}
}

func SetupRouter() *gin.Engine {
	router := gin.Default()

	attachMiddlewares(router)
	attachRoutes(router)

	return router
}
