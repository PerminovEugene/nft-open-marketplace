package pinata

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func NewPinataClient() (*PinataClient, error) {
	token := os.Getenv("JWT")
	if token == "" {
			return nil, errors.New("JWT token not set in environment variables")
	}

	return &PinataClient{
			BaseURL: "https://uploads.pinata.cloud",
			Client:  &http.Client{},
			Token:   token,
	}, nil
}

func (p *PinataClient) PinFile(file io.Reader, fileName, nftName, groupId string) (PinataResponse, error) {
	var pinataResponse PinataResponse
	errChan := make(chan error, 1)
	responseChan := make(chan PinataResponse, 1)

	pr, pw := io.Pipe()
	multipartWriter := multipart.NewWriter(pw)

	// copy file to pipe
	go func() {
		defer pw.Close()
		defer multipartWriter.Close()

		formFile, err := multipartWriter.CreateFormFile("file", fileName)
		if err != nil {
			errChan <- fmt.Errorf("Error creating form file: %w", err)
			return
		}

		_, err = io.Copy(formFile, file)
		if err != nil {
			errChan <- fmt.Errorf("Error copying file data: %w", err)
			return
		}

		if nftName != "" {
			err = multipartWriter.WriteField("name", nftName)
			if err != nil {
				errChan <- fmt.Errorf("Error adding nftName field: %w", err)
				return
			}
		}

		if groupId != "" {
			err = multipartWriter.WriteField("group_id", groupId)
			if err != nil {
				errChan <- fmt.Errorf("Error adding groupId field: %w", err)
				return
			}
		}

		errChan <- nil
	}()

	// http request
	req, err := http.NewRequest("POST", p.BaseURL+"/v3/files", pr)
	if err != nil {
		return pinataResponse, fmt.Errorf("Error creating request: %w", err)
	}

	req.Header.Set("Content-Type", multipartWriter.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+p.Token)

	// send to pinata
	go func() {
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			errChan <- fmt.Errorf("Error sending request to Pinata: %w", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			errChan <- fmt.Errorf("Pinata responded with status: %s", resp.Status)
			return
		}

		// Чтение и декодирование ответа
		err = json.NewDecoder(resp.Body).Decode(&pinataResponse)
		if err != nil {
			errChan <- fmt.Errorf("Error decoding Pinata response: %w", err)
			return
		}

		responseChan <- pinataResponse
	}()

	// waiting end of writing goroutine
	if err := <-errChan; err != nil {
		return pinataResponse, err
	}

	// waiting end of request goroutine
	select {
	case err := <-errChan:
		if err != nil {
			return pinataResponse, err
		}
	case pinataResponse = <-responseChan:
		// success
	}

	return pinataResponse, nil
}