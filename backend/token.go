package main

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Generates a JSON web token that expires in 30 mins
func GenerateToken(user *User) (string, error) {

	claims := jwt.MapClaims{}
	claims["uname"] = user.Uname
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()
	claims["authorized"] = true

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims)

	tokenStr, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	return tokenStr, err
}

// Returns uname if token is valid
func IsValidToken(tokenStr string) (string, error) {

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("token signing method is not valid: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}

	// Parse uname from claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		uname := claims["uname"]
		return uname.(string), nil
	}

	return "", fmt.Errorf("failed to parse token")
}
