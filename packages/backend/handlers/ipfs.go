// internal/handlers/ifps_handler.go
package handlers

import (
	"log"
	"mime/multipart"
	"net/http"

	"backend/clients/pinata"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type IfpsHandler struct {
	PinataClient *pinata.PinataClient
}

func NewIfpsHandler(client *pinata.PinataClient) *IfpsHandler {
	return &IfpsHandler{
		PinataClient: client,
	}
}

func (h *IfpsHandler) IfpsUploadFile(c *gin.Context) {
	fileHeader, err := getFileFromContext(c)
	if err != nil {
		c.String(http.StatusBadRequest, "Error retrieving file: %s", err.Error())
		return
	}
	log.Println("Received file:", fileHeader.Filename)

	uploadedFile, err := openUploadedFile(fileHeader)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error opening file: %s", err.Error())
		return
	}
	defer uploadedFile.Close()

	nftName, groupId := getAdditionalFields(c)

	pinataResponse, err := h.PinataClient.PinFile(uploadedFile, fileHeader.Filename, nftName, groupId)
	if err != nil {
		log.Println("Error uploading to Pinata:", err)
		c.String(http.StatusInternalServerError, "Error uploading file: %s", err.Error())
		return
	}

	c.JSON(http.StatusOK, pinataResponse)
}

func getFileFromContext(c *gin.Context) (*multipart.FileHeader, error) {
	return c.FormFile("file")
}

func openUploadedFile(fileHeader *multipart.FileHeader) (multipart.File, error) {
	return fileHeader.Open()
}

func getAdditionalFields(c *gin.Context) (nftName, groupId string) {
	nftName = c.PostForm("nftName")

	// Later uuid logic should be updated to support nft collections
	groupId = uuid.New().String()
	return
}
