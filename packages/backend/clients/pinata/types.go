package pinata

import (
	"io"
	"net/http"
)

type PinataClientInterface interface {
	PinFile(file io.Reader, fileName string, nftName, groupId string) (PinataPinFileData, error)
	pinJSON(cid, description, name string) (PinataPinFileData, error)
}

type PinataClient struct {
	BaseURL   string
	Client    *http.Client
	Jwt       string
	ApiSecret string
	ApiKey    string
}

// Upload file

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

// PINs

type PinataPinFileData struct {
	IPFSHash    string `json:"IpfsHash"`
	PinSize     int    `json:"PinSize"`
	Timestamp   string `json:"Timestamp"`
	IsDuplicate bool   `json:"isDuplicate"`
}

type PinataPinFileResponse struct {
	Data PinataPinFileData `json:"data"`
}

type PinataPinJsonResponse struct {
	Data PinataPinFileData `json:"data"`
}
