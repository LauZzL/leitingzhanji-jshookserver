package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	http.HandleFunc("/res", ResponseHandler)
	http.HandleFunc("/req", RequestHadnler)
	http.HandleFunc("/", root)
	err := http.ListenAndServe(":2026", nil)
	if err != nil {
		return
	}
	fmt.Println("Server started at port 2026")
}

func root(response http.ResponseWriter, request *http.Request) {
	io.WriteString(response, "ok")
}

func ResponseHandler(response http.ResponseWriter, request *http.Request) {
	body, _ := io.ReadAll(request.Body)
	fmt.Println("Response => " + string(body))
	io.WriteString(response, "ok")
}

func RequestHadnler(response http.ResponseWriter, request *http.Request) {
	body, _ := io.ReadAll(request.Body)
	fmt.Println("Request => " + string(body))
	io.WriteString(response, "ok")
}
