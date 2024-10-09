// module github.com/PerminovEugene/nft-open-marketplace
module backend

go 1.16

require (
	github.com/gin-contrib/cors v1.7.2 // indirect
	github.com/gin-gonic/gin v1.10.0
	github.com/google/uuid v1.6.0 // indirect
	github.com/joho/godotenv v1.5.1
)

replace github.com/PerminovEugene/nft-open-marketplace/utils => ./src/utils
