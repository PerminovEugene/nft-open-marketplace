package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"backend/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {
	middlewares.SetupEnv()

	router := gin.Default()
	router.Use(middlewares.SetupCORS())

	token := os.Getenv("JWT")

	router.GET("/", func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
    // c.JSON(resp.StatusCode, pinataResponse)
		c.JSON(http.StatusOK, gin.H{
			"hello": "world",
		})
	})

	router.POST("/upload", func(c *gin.Context) {
		// Retrieve the file
		fileHeader, err := c.FormFile("file")
		if err != nil {
			c.String(http.StatusBadRequest, "Error retrieving file: %s", err.Error())
			return
		}
		log.Println("Received file:", fileHeader.Filename)

		// Open the uploaded file
		uploadedFile, err := fileHeader.Open()
		if err != nil {
			c.String(http.StatusInternalServerError, "Error opening file: %s", err.Error())
			return
		}
		defer uploadedFile.Close()

		// Create a pipe
		pr, pw := io.Pipe()
		multipartWriter := multipart.NewWriter(pw)

		// Error channel to capture errors from the goroutine
		errChan := make(chan error, 1)

		// Start a goroutine to write the multipart data to the pipe writer
		go func() {
			defer pw.Close()
			defer multipartWriter.Close()

			// Create the form file field
			formFile, err := multipartWriter.CreateFormFile("file", fileHeader.Filename)
			if err != nil {
				errChan <- fmt.Errorf("Error creating form file: %w", err)
				return
			}

			// Copy the uploaded file data into the form file
			_, err = io.Copy(formFile, uploadedFile)
			if err != nil {
				errChan <- fmt.Errorf("Error copying file data: %w", err)
				return
			}

			// Add additional form fields
			nftName := c.PostForm("nftName")
			if nftName != "" {
				err = multipartWriter.WriteField("name", nftName)
				if err != nil {
					errChan <- fmt.Errorf("Error adding nftName field: %w", err)
					return
				}
			}

			groupId := c.PostForm("groupId")
			if groupId != "" {
				err = multipartWriter.WriteField("group_id", groupId)
				if err != nil {
					errChan <- fmt.Errorf("Error adding groupId field: %w", err)
					return
				}
			}

			// Close the multipart writer to finalize the form data
			errChan <- nil
		}()

		// Create a new HTTP request to the external API
		req, err := http.NewRequest("POST", "https://uploads.pinata.cloud/v3/files", pr)
		if err != nil {
			c.String(http.StatusInternalServerError, "Error creating request: %s", err.Error())
			return
		}

		// Set the appropriate headers
		req.Header.Set("Content-Type", multipartWriter.FormDataContentType())
		req.Header.Set("Authorization", "Bearer "+token)

		// Send the request to the external API
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			log.Println("error from pinata:")

			c.String(http.StatusInternalServerError, "Error sending request to external API: %s", err.Error())
			return
		}
		defer resp.Body.Close()

		// Wait for the goroutine to finish and check for errors
		if err := <-errChan; err != nil {
			log.Println(err)

			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Read the response from the external API
		responseBody, err := io.ReadAll(resp.Body)
		if err != nil {
			c.String(http.StatusInternalServerError, "Error reading response: %s", err.Error())
			return
		}

    // Convert byte array to string (optional)
    responseString := string(responseBody)
    fmt.Println("Response String:", responseString)

		// {
		// 	"data":
		// 	{
		// 		"id":"019267c4-b5ae-7510-8386-dc8f245b7e0f",
		// 		"name":"tester1",
		// 		"cid":"bafybeihzhv5h5oztzsct7zmg6s4hhcb6e6j7n2d4aqon4bcza3sxekf7da",
		// 		"created_at":"2024-10-07T16:16:39.191Z",
		// 		"size":2619702,
		// 		"number_of_files":1,
		// 		"mime_type":"application/octet-stream",
		// 		"user_id":"b6a66266-1b3f-4943-b672-e895d9d27236"
		// 	}
		// }

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

			var pinataResponse PinataResponse
			err = json.Unmarshal(responseBody, &pinataResponse)
			if err != nil {
				log.Printf("Error parsing JSON response: %v", err)
				// Send an appropriate error response
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid JSON from Pinata"})
				return
			}

			// Use the parsed data as needed
			fmt.Printf("Uploaded File CID: %s\n", pinataResponse)

			// Forward the response back to the client
			c.Header("Content-Type", "application/json")
			// c.JSON(resp.StatusCode, pinataResponse)
			c.JSON(http.StatusOK, pinataResponse)
	})

	router.Run(":8080")
}
