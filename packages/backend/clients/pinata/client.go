package pinata

import (
	"errors"
	"net/http"
	"os"
)

func NewPinataClient() (*PinataClient, error) {
	jwt := os.Getenv("PINATA_JWT")
	apiKey := os.Getenv("PINATA_API_KEY")
	secret := os.Getenv("PINATA_API_SECRET")

	if jwt == "" || apiKey == "" || secret == "" {
		return nil, errors.New("Pinata config is invalid")
	}

	return &PinataClient{
		BaseURL:   "https://api.pinata.cloud",
		Client:    &http.Client{},
		Jwt:       jwt,
		ApiKey:    apiKey,
		ApiSecret: secret,
	}, nil
}
