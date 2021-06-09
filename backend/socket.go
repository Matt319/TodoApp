package main

import (
	"encoding/json"
	"fmt"

	"gopkg.in/olahol/melody.v1"
)

// Handles when a user connects
func HandleConnect(s *melody.Session) {
	token := s.Request.URL.Query().Get("token")
	uname, err := IsValidToken(token)

	// Check for verification failure
	if err != nil {
		s.Close()
		return
	}

	fmt.Println("Connected user:", uname)
	s.Set("uname", uname)

	socketPool[uname] = append(socketPool[uname], s)
}

// Handles when a user disconnects
func HandleDisconnect(s *melody.Session) {
	uname, ok := s.Get("uname")
	if !ok {
		return
	}

	userSessions := socketPool[uname.(string)]

	for i := 0; i < len(userSessions); i++ {
		if userSessions[i] == s {
			socketPool[uname.(string)] = append(userSessions[:i], userSessions[i+1:]...)
		}
	}
	fmt.Println("Disconnected user:", uname)
}

// Finds and returns pointer to proper sockets for user
func FindSockets(uname string) []*melody.Session {
	return socketPool[uname]
}

// Sends a new todo to correct socket
func SendNewTodo(todo Todo) {
	sockets := FindSockets(todo.Uid)

	for _, socket := range sockets {

		data := SocketEvent{
			Event: "ADD",
			Data:  todo,
		}
		byteData, _ := json.Marshal(data)
		socket.Write(byteData)
	}
}

// Sends an updated Todo to the correct socket
func SendTodoUpdate(todo Todo) {
	sockets := FindSockets(todo.Uid)

	for _, socket := range sockets {

		data := SocketEvent{
			Event: "UPDATE",
			Data:  todo,
		}
		byteData, _ := json.Marshal(data)
		socket.Write(byteData)
	}
}

// Sends the Todo that was deleted to the correct socket
func SendTodoDelete(todo Todo) {
	sockets := FindSockets(todo.Uid)

	for _, socket := range sockets {

		data := SocketEvent{
			Event: "DELETE",
			Data:  todo,
		}
		byteData, _ := json.Marshal(data)
		socket.Write(byteData)
	}
}
