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

func Optional(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func (h *IfpsHandler) IfpsPinImageAndMeta(c *gin.Context) {
	fileHeader, err := getFileFromContext(c)
	if err != nil {
		c.String(http.StatusBadRequest, "Error retrieving file: %s", err.Error())
		return
	}

	uploadedFile, err := openUploadedFile(fileHeader)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error opening file: %s", err.Error())
		return
	}
	defer uploadedFile.Close()

	name, groupId := getAdditionalFields(c)

	// pin file

	pinFileResponse, err := h.PinataClient.PinFile(uploadedFile, fileHeader.Filename, name, groupId)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error during pinning iamge: %s", err.Error())
		return
	}

	cid := pinFileResponse.IPFSHash

	// pinning json

	pinJsonArgs := pinata.PinJsonArgs{
		Name:            name,
		CID:             cid,
		Description:     c.PostForm("description"),
		ExternalUrl:     Optional(c.PostForm("externalUrl")),
		BackgroundColor: Optional(c.PostForm("backgroundColor")),
		AnimationUrl:    Optional(c.PostForm("animationUrl")),
		YoutubeUrl:      Optional(c.PostForm("youtubeUrl")),
	}
	pinJsonResponse, err := h.PinataClient.PinJson(pinJsonArgs)
	if err != nil {
		log.Println("Error uploading to Pinata:", err)
		c.String(http.StatusInternalServerError, "Error during uploading meta file: %s", err.Error())
		return
	}

	c.JSON(http.StatusOK, pinJsonResponse)
}

func getFileFromContext(c *gin.Context) (*multipart.FileHeader, error) {
	return c.FormFile("file")
}

func openUploadedFile(fileHeader *multipart.FileHeader) (multipart.File, error) {
	return fileHeader.Open()
}

func getAdditionalFields(c *gin.Context) (nftName, groupId string) {
	nftName = c.PostForm("name")

	// Later uuid logic should be updated to support nft collections
	groupId = uuid.New().String()
	return
}
