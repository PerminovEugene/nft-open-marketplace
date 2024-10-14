package pinata

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Attribute struct {
	TraitType string
	Value     string
}

type PinJsonArgs struct {
	CID             string
	Description     string
	Name            string
	ExternalUrl     *string
	BackgroundColor *string
	AnimationUrl    *string
	YoutubeUrl      *string
	Attributes      []Attribute
}

func (p *PinataClient) PinJson(pinJsonArgs PinJsonArgs) (PinataPinFileData, error) {
	var pinataResponse PinataPinFileData

	jsonData := map[string]interface{}{
		"pinataContent": map[string]interface{}{
			"name":             pinJsonArgs.Name,
			"description":      pinJsonArgs.Description,
			"image":            pinJsonArgs.CID,
			"attributes":       pinJsonArgs.Attributes,
			"external_url":     pinJsonArgs.ExternalUrl,
			"animation_url":    pinJsonArgs.AnimationUrl,
			"background_color": pinJsonArgs.BackgroundColor,
			"youtube_url":      pinJsonArgs.YoutubeUrl,
		},
		"pinataOptions": map[string]interface{}{
			"cidVersion": 1,
		},
		"pinataMetadata": map[string]interface{}{
			"name": pinJsonArgs.Name + ".json",
		},
	}

	// prepare request body

	jsonBytes, err := json.Marshal(jsonData)
	if err != nil {
		fmt.Println("Ошибка при сериализации JSON:", err)
		return pinataResponse, err
	}

	// create http request

	req, err := http.NewRequest("POST", p.BaseURL+"/pinning/pinJSONToIPFS", bytes.NewBuffer(jsonBytes))
	if err != nil {
		fmt.Println("Ошибка при создании запроса:", err)
		return pinataResponse, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("pinata_api_key", p.ApiKey)
	req.Header.Set("pinata_secret_api_key", p.ApiSecret)

	// do request

	client := p.Client
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error from Pinata json pin endpoint", err)
		return pinataResponse, err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error response reading", err)
		return pinataResponse, err
	}

	// return json response

	err = json.Unmarshal(bodyBytes, &pinataResponse)
	if err != nil {
		fmt.Println("Error unmarshaling json pinning response", err)
		return pinataResponse, err
	}
	return pinataResponse, nil
}
