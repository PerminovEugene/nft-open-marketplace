package pinata

import (
	"io"
	"net/http"
)

type PinataClientInterface interface {
	PinFile(file io.Reader, fileName string, nftName, groupId string) (PinataResponse, error)
}

type PinataClient struct {
	BaseURL string
	Client  *http.Client
	Token   string
}

type PinataData struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	CID           string `json:"cid"`
	CreatedAt     string `json:"created_at"`
	Size          int    `json:"size"`
	NumberOfFiles int    `json:"number_of_files"`
	MimeType      string `json:"mime_type"`
	UserID        string `json:"user_id"`
}

type PinataResponse struct {
	Data PinataData `json:"data"`
}
