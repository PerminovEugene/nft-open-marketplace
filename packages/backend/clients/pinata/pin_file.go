package pinata

import (
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
)

func (p *PinataClient) PinFile(file io.Reader, fileName, nftName, groupId string) (PinataPinFileData, error) {
	var pinataResponse PinataPinFileData
	pr, pw := io.Pipe()
	multipartWriter := multipart.NewWriter(pw)

	// Write the multipart form data in a goroutine

	go func() {
		defer pw.Close()
		defer multipartWriter.Close()

		// Write the file part
		formFile, err := multipartWriter.CreateFormFile("file", fileName)
		if err != nil {
			pw.CloseWithError(fmt.Errorf("Error creating form file: %w", err))
			return
		}

		_, err = io.Copy(formFile, file)
		if err != nil {
			pw.CloseWithError(fmt.Errorf("Error copying file data: %w", err))
			return
		}

		addPinataMetaToForm(fileName, pw, multipartWriter)
	}()

	// Create the HTTP request

	req, err := http.NewRequest("POST", p.BaseURL+"/pinning/pinFileToIPFS", pr)
	if err != nil {
		return pinataResponse, fmt.Errorf("Error creating request: %w", err)
	}

	req.Header.Set("Content-Type", multipartWriter.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+p.Jwt)

	// Send the request

	client := p.Client
	resp, err := client.Do(req)
	if err != nil {
		return pinataResponse, fmt.Errorf("Error sending request to Pinata: %w", err)
	}
	defer resp.Body.Close()

	// process response

	bodyBytes, _ := io.ReadAll(resp.Body)
	if err != nil {
		return pinataResponse, fmt.Errorf("Error reading response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return pinataResponse, fmt.Errorf("Pinata responded with %d: %s", resp.StatusCode, string(bodyBytes))
	}

	err = json.Unmarshal(bodyBytes, &pinataResponse)
	if err != nil {
		fmt.Println("Error decoding Pinata response", err)
		return pinataResponse, err
	}

	return pinataResponse, nil
}

func addPinataMetaToForm(
	name string,
	pw *io.PipeWriter,
	multipartWriter *multipart.Writer,
) {
	// Write the metadata part

	metadata := map[string]string{
		"name": name,
	}
	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
		pw.CloseWithError(fmt.Errorf("Error marshaling metadata: %w", err))
		return
	}

	err = multipartWriter.WriteField("pinataMetadata", string(metadataJSON))
	if err != nil {
		pw.CloseWithError(fmt.Errorf("Error writing metadata field: %w", err))
		return
	}

	// Write the options part

	options := map[string]uint{
		"cidVersion": 1,
	}
	optionsJSON, err := json.Marshal(options)
	if err != nil {
		pw.CloseWithError(fmt.Errorf("Error marshaling options: %w", err))
		return
	}

	err = multipartWriter.WriteField("pinataOptions", string(optionsJSON))
	if err != nil {
		pw.CloseWithError(fmt.Errorf("Error writing options field: %w", err))
		return
	}
}
