package main

import (
	"time"

	"gopkg.in/olahol/melody.v1"
)

// Todo Model
type Todo struct {
	Description string    `json:"desc" binding:"required"`
	Due         time.Time `json:"due" binding:"required"`
	State       int       `json:"state" binding:"required"`
	Tid         int       `json:"tid"`
	Uid         string    `json:"uid"`
}

// User Model
type User struct {
	Uname string `json:"uname" binding:"required"`
	Pass  string `json:"pass" binding:"required"`
}

// SocketEvent Model
type SocketEvent struct {
	Event string
	Data  Todo
}

// SocketPool Model
type SocketPool map[string][]*melody.Session
