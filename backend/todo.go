package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Add todo from request to db
func AddTodo(c *gin.Context) {

	var todo Todo

	// Map request body to user struct
	if err := c.ShouldBindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, "Invalid Params")
		c.Abort()
		return
	}

	uname, ok := c.Get("uname")
	if !ok {
		c.JSON(http.StatusUnauthorized, "UID not provided in token")
		c.Abort()
		return
	}

	stmt, err := db.Prepare("INSERT INTO todo (due, state, desc, uid) VALUES (?, ?, ?, ?)")
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not prepare sql")
		c.Abort()
		return
	}

	res, err := stmt.Exec(todo.Due, todo.State, todo.Description, uname)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not execute sql")
		c.Abort()
		return
	}

	tid, _ := res.LastInsertId() // We can ignore the error since we know the query passed and the columns are static
	todo.Tid = int(tid)
	todo.Uid = uname.(string)
	SendNewTodo(todo) // Send the new todo to the users socket so it updates the client

	c.JSON(http.StatusOK, "Success") // Return 200
}

// Fetches all todos for specific user
func FetchTodo(c *gin.Context) {

	uname, ok := c.Get("uname")
	if !ok {
		c.JSON(http.StatusUnauthorized, "UID not provided in token")
		c.Abort()
		return
	}

	// Query all todos for specific user
	rows, err := db.Query("SELECT * FROM todo WHERE uid = ?", uname)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not execute sql")
		c.Abort()
		return
	}

	var todos []Todo

	// Iterate though query results
	for rows.Next() {
		var todo Todo

		err = rows.Scan(&todo.Tid, &todo.Due, &todo.State, &todo.Description, &todo.Uid)
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, err.Error())
			c.Abort()
			return
		}

		todos = append(todos, todo)
	}

	// Return the todos
	c.JSON(http.StatusOK, todos)
	c.Abort()
}

// Updates the specified todo
func UpdateTodo(c *gin.Context) {
	var todo Todo

	// Map request body to user struct
	if err := c.ShouldBindJSON(&todo); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		c.Abort()
		return
	}

	uname, ok := c.Get("uname")
	if !ok {
		c.JSON(http.StatusUnauthorized, "UID not provided in token")
		c.Abort()
		return
	}

	stmt, err := db.Prepare("UPDATE todo SET due=?, state=?, desc=? WHERE tid=? AND uid=?")
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not prepare sql")
		c.Abort()
		return
	}

	_, err = stmt.Exec(todo.Due, todo.State, todo.Description, todo.Tid, uname)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not execute sql")
		c.Abort()
		return
	}

	todo.Uid = uname.(string)
	SendTodoUpdate(todo)
	c.JSON(http.StatusOK, "Success")
	c.Abort()
}

// Deletes the specified todo
func DeleteTodo(c *gin.Context) {
	tid := c.Param("tid")

	// Get uname from token
	uname, ok := c.Get("uname")
	if !ok {
		c.JSON(http.StatusUnauthorized, "UID not provided in token")
		c.Abort()
		return
	}

	// Prepare sql
	stmt, err := db.Prepare("DELETE FROM todo WHERE tid=? AND uid=?")
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not prepare sql")
		c.Abort()
		return
	}

	// Execute sql
	_, err = stmt.Exec(tid, uname)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Could not execute sql")
		c.Abort()
		return
	}

	// Create dummy todo since we only care about tid
	var todo Todo
	todo.Tid, _ = strconv.Atoi(tid)
	todo.Uid = uname.(string)
	SendTodoDelete(todo)
	c.JSON(http.StatusAccepted, "Success")
	c.Abort()
}
