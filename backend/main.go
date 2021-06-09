package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/olahol/melody.v1"
)

var db *sql.DB // Global database variable

var m *melody.Melody // Global websocket variable

var socketPool SocketPool

func GinMiddleware(allowOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-CSRF-Token, Token, session, Origin, Host, Connection, Accept-Encoding, Accept-Language, X-Requested-With")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Request.Header.Del("Origin")

		c.Next()
	}
}

// Main
func main() {

	// Load env file
	godotenv.Load()

	// Initialize Router
	router := gin.Default()

	// Initialize Melody
	m = melody.New()
	m.HandleConnect(HandleConnect)
	m.HandleDisconnect(HandleDisconnect)

	socketPool = SocketPool{} // Setup socketpool

	// Recover from panics
	router.Use(gin.Recovery())

	// Setup CORS
	router.Use(GinMiddleware(fmt.Sprintf("http://localhost:%s", os.Getenv("CLIENT_PORT"))))

	// Route Handlers
	router.POST("/auth", Login)

	router.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	router.POST("/tasks", Authenticate(), AddTodo)
	router.GET("/tasks", Authenticate(), FetchTodo)
	router.PATCH("/tasks", Authenticate(), UpdateTodo)
	router.DELETE("/tasks/:tid", Authenticate(), DeleteTodo)

	// Connect to db
	database, err := sql.Open("sqlite3", "./assignment.db")
	db = database
	if err != nil {
		panic(err)
	}

	log.Fatal(router.Run(fmt.Sprintf(":%s", os.Getenv("SERVER_PORT"))))
}

// Middleware for authenticated endpoints
func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")

		uname, err := IsValidToken(token)

		// Check for verification failure
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}

		c.Set("uname", uname) // Store uname in context
		c.Next()
	}
}
