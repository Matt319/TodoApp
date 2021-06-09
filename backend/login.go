package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Authenticates a user and sends back a token
func Login(c *gin.Context) {

	var user User

	// Map request body to user struct
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, "Invalid Params")
		c.Abort()
		return
	}

	// Make database request to see if there is a match
	rows, err := db.Query("SELECT COUNT(*) AS count FROM users WHERE uname=? AND pass=?", user.Uname, user.Pass)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		c.Abort()
		return
	}
	var exists bool
	for rows.Next() {
		rows.Scan(&exists)
	}
	if !exists {
		c.JSON(http.StatusUnauthorized, "Please enter valid login credentials")
		c.Abort()
		return
	}

	// Generate token
	token, err := GenerateToken(&user)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		c.Abort()
		return
	}

	// Return the token
	c.JSON(http.StatusOK, token)
}
