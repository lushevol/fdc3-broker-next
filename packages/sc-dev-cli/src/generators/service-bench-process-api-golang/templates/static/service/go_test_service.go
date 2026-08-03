package service

import (
	"fmt"
	"net/http"

	"sampleProject/dto"
	"sampleProject/model"
	"sampleProject/repo"

	"github.com/gin-gonic/gin"
)

type GoTestService struct {
	Repo repo.GoTestRepository
}

func NewGoTestService(r repo.GoTestRepository) *GoTestService {
	return &GoTestService{Repo: r}
}

func (s *GoTestService) TestDemo(c *gin.Context) {
	c.JSON(http.StatusOK, "task")
}

// CreateGoTestHandler creates a new record
func (s *GoTestService) CreateGoTestHandler(c *gin.Context) {
	var req dto.GoTestCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := s.Repo.CreateGoTest(&model.GoTest{ID: req.ID, Name: req.Name}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, req)
}

// GetGoTestHandler gets a record by id
func (s *GoTestService) GetGoTestHandler(c *gin.Context) {
	id := c.Param("id")
	task, err := s.Repo.GetGoTestByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

// ListGoTestsHandler gets all records
func (s *GoTestService) ListGoTestsHandler(c *gin.Context) {
	tasks, err := s.Repo.ListGoTests()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

// UpdateGoTestHandler updates a record by id
func (s *GoTestService) UpdateGoTestHandler(c *gin.Context) {
	id := c.Param("id")
	var req dto.GoTestUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := s.Repo.UpdateGoTest(id, req.Name); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Record updated successfully"})
}

// DeleteGoTestHandler deletes a record by id
func (s *GoTestService) DeleteGoTestHandler(c *gin.Context) {
	id := c.Param("id")
	if err := s.Repo.DeleteGoTest(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Record deleted successfully"})
}

// ListGoTestsWithFilterHandler paginated and filtered query
func (s *GoTestService) ListGoTestsWithFilterHandler(c *gin.Context) {
	page := 1
	size := 10
	if p := c.Query("page"); p != "" {
		fmt.Sscanf(p, "%d", &page)
	}
	if sParam := c.Query("size"); sParam != "" {
		fmt.Sscanf(sParam, "%d", &size)
	}
	id := c.Query("id")
	name := c.Query("name")
	total, tasks, err := s.Repo.ListGoTestsWithFilter(page, size, id, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"total": total,
		"page":  page,
		"size":  size,
		"data":  tasks,
	})
}
