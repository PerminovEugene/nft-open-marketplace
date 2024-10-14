// internal/handlers/ifps_handler.go
package handlers

import (
	"encoding/json"
	"mime/multipart"
	"net/http"

	"backend/clients/pinata"

	"github.com/gin-gonic/gin"
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

type Attribute struct {
	TraitType string `json:"traitType"`
	Value     string `json:"value"`
}

type JsonDetails struct {
	Description     string      `json:"description"`
	Name            string      `json:"name"`
	ExternalUrl     *string     `json:"externalUrl"`
	BackgroundColor *string     `json:"backgroundColor"`
	AnimationUrl    *string     `json:"animationUrl"`
	YoutubeUrl      *string     `json:"youtubeUrl"`
	Attributes      []Attribute `json:"attributes"`
}
type RequestData struct {
	Data JsonDetails `json:"data"`
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

	// pin file

	pinFileResponse, err := h.PinataClient.PinFile(uploadedFile, fileHeader.Filename)
	if err != nil {
		c.String(http.StatusInternalServerError, "Error during pinning iamge: %s", err.Error())
		return
	}

	cid := pinFileResponse.IPFSHash

	// pinning json
	jsonStr := c.PostForm("data")
	if jsonStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data not provided"})
		return
	}
	var requestData JsonDetails
	if err := json.Unmarshal([]byte(jsonStr), &requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pinJsonArgs := pinata.PinJsonArgs{
		Name:            requestData.Name,
		CID:             cid,
		Description:     requestData.Description,
		ExternalUrl:     requestData.ExternalUrl,
		BackgroundColor: requestData.BackgroundColor,
		AnimationUrl:    requestData.AnimationUrl,
		YoutubeUrl:      requestData.YoutubeUrl,
	}
	var pinataAttributes []pinata.Attribute
	for _, attr := range requestData.Attributes {
		pinataAttr := pinata.Attribute{
			TraitType: attr.TraitType,
			Value:     attr.Value,
		}
		pinataAttributes = append(pinataAttributes, pinataAttr)
	}
	pinJsonArgs.Attributes = pinataAttributes

	pinJsonResponse, err := h.PinataClient.PinJson(pinJsonArgs)
	if err != nil {
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
