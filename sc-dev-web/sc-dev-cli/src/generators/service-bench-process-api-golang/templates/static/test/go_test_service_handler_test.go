package test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sampleProject/dto"
	"sampleProject/model"
	"sampleProject/service"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockRepo struct{ mock.Mock }

func (m *MockRepo) CreateGoTest(task *model.GoTest) error {
	args := m.Called(task)
	return args.Error(0)
}
func (m *MockRepo) GetGoTestByID(id string) (*model.GoTest, error) {
	args := m.Called(id)
	return args.Get(0).(*model.GoTest), args.Error(1)
}
func (m *MockRepo) ListGoTests() ([]model.GoTest, error) {
	args := m.Called()
	return args.Get(0).([]model.GoTest), args.Error(1)
}
func (m *MockRepo) UpdateGoTest(id, name string) error {
	args := m.Called(id, name)
	return args.Error(0)
}
func (m *MockRepo) DeleteGoTest(id string) error {
	args := m.Called(id)
	return args.Error(0)
}
func (m *MockRepo) TestDBConnection() error {
	args := m.Called()
	return args.Error(0)
}
func (m *MockRepo) ListGoTestsWithFilter(page, size int, id, name string) (int64, []model.GoTest, error) {
	args := m.Called(page, size, id, name)
	return args.Get(0).(int64), args.Get(1).([]model.GoTest), args.Error(2)
}

func setupRouter(svc *service.GoTestService) *gin.Engine {
	r := gin.Default()
	r.POST("/case-task", svc.CreateGoTestHandler)
	r.GET("/case-task/:id", svc.GetGoTestHandler)
	r.GET("/case-tasks", svc.ListGoTestsHandler)
	r.PUT("/case-task/:id", svc.UpdateGoTestHandler)
	r.DELETE("/case-task/:id", svc.DeleteGoTestHandler)
	r.GET("/case-task/list", svc.ListGoTestsWithFilterHandler)
	return r
}

// Merge handler/service test content, supplement all handler/service branch tests
// You can paste all test content of go_task_handler_test.go here, mock repo

func TestCreateGoTestHandler(t *testing.T) {
	t.Run("Create task successfully", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("CreateGoTest", mock.AnythingOfType("*model.GoTest")).Return(nil)

		task := dto.GoTestCreateRequest{ID: "1", Name: "test task"}
		jsonValue, _ := json.Marshal(task)
		req, _ := http.NewRequest("POST", "/case-task", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusCreated, res.Code)
		mockRepo.AssertCalled(t, "CreateGoTest", mock.AnythingOfType("*model.GoTest"))
	})

	t.Run("Create task failed", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("CreateGoTest", mock.AnythingOfType("*model.GoTest")).Return(assert.AnError)

		task := dto.GoTestCreateRequest{ID: "1", Name: "test task"}
		jsonValue, _ := json.Marshal(task)
		req, _ := http.NewRequest("POST", "/case-task", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		mockRepo.AssertCalled(t, "CreateGoTest", mock.AnythingOfType("*model.GoTest"))
	})
}

func TestGetGoTestHandler(t *testing.T) {
	t.Run("Get task by ID successfully", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("GetGoTestByID", "1").Return(&model.GoTest{ID: "1", Name: "test task"}, nil)

		req, _ := http.NewRequest("GET", "/case-task/1", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusOK, res.Code)

		var response model.GoTest
		json.NewDecoder(res.Body).Decode(&response)
		assert.Equal(t, "1", response.ID)
		assert.Equal(t, "test task", response.Name)

		mockRepo.AssertCalled(t, "GetGoTestByID", "1")
	})

	t.Run("Get task by ID failed", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("GetGoTestByID", "1").Return(nil, assert.AnError)

		req, _ := http.NewRequest("GET", "/case-task/1", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		mockRepo.AssertCalled(t, "GetGoTestByID", "1")
	})
}

func TestListGoTestsHandler(t *testing.T) {
	t.Run("Get task list successfully", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("ListGoTests").Return([]model.GoTest{{ID: "1", Name: "test task"}}, nil)

		req, _ := http.NewRequest("GET", "/case-tasks", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusOK, res.Code)

		var response []model.GoTest
		json.NewDecoder(res.Body).Decode(&response)
		assert.Len(t, response, 1)
		assert.Equal(t, "1", response[0].ID)
		assert.Equal(t, "test task", response[0].Name)

		mockRepo.AssertCalled(t, "ListGoTests")
	})

	t.Run("Get task list failed", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("ListGoTests").Return(nil, assert.AnError)

		req, _ := http.NewRequest("GET", "/case-tasks", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		mockRepo.AssertCalled(t, "ListGoTests")
	})
}

func TestUpdateGoTestHandler(t *testing.T) {
	t.Run("Update task by ID successfully", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("UpdateGoTest", "1", "Updated task name").Return(nil)

		task := dto.GoTestUpdateRequest{Name: "Updated task name"}
		jsonValue, _ := json.Marshal(task)

		req, _ := http.NewRequest("PUT", "/case-task/1", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusOK, res.Code)
		mockRepo.AssertCalled(t, "UpdateGoTest", "1", "Updated task name")
	})

	t.Run("Update task by ID failed", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("UpdateGoTest", "1", "Updated task name").Return(assert.AnError)

		task := dto.GoTestUpdateRequest{Name: "Updated task name"}
		jsonValue, _ := json.Marshal(task)

		req, _ := http.NewRequest("PUT", "/case-task/1", bytes.NewBuffer(jsonValue))
		req.Header.Set("Content-Type", "application/json")
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		mockRepo.AssertCalled(t, "UpdateGoTest", "1", "Updated task name")
	})
}

func TestDeleteGoTestHandler(t *testing.T) {
	t.Run("Delete task by ID successfully", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("DeleteGoTest", "1").Return(nil)

		req, _ := http.NewRequest("DELETE", "/case-task/1", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusOK, res.Code)
		mockRepo.AssertCalled(t, "DeleteGoTest", "1")
	})

	t.Run("Delete task by ID failed", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("DeleteGoTest", "1").Return(assert.AnError)

		req, _ := http.NewRequest("DELETE", "/case-task/1", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		mockRepo.AssertCalled(t, "DeleteGoTest", "1")
	})
}

func TestListGoTestsWithFilterHandler(t *testing.T) {
	t.Run("Get task list by conditions successfully", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("ListGoTestsWithFilter", 1, 10, "1", "test task").Return(int64(1), []model.GoTest{{ID: "1", Name: "test task"}}, nil)

		req, _ := http.NewRequest("GET", "/case-task/list?page=1&size=10&id=1&name=test task", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusOK, res.Code)

		var response struct {
			Total int64          `json:"total"`
			Data  []model.GoTest `json:"data"`
		}
		err := json.NewDecoder(res.Body).Decode(&response)
		assert.NoError(t, err)
		assert.Equal(t, int64(1), response.Total)
		assert.Len(t, response.Data, 1)
		assert.Equal(t, "1", response.Data[0].ID)
		assert.Equal(t, "test task", response.Data[0].Name)

		mockRepo.AssertCalled(t, "ListGoTestsWithFilter", 1, 10, "1", "test task")
	})

	t.Run("Get task list by conditions failed", func(t *testing.T) {
		mockRepo := new(MockRepo)
		svc := service.NewGoTestService(mockRepo)
		router := setupRouter(svc)
		mockRepo.On("ListGoTestsWithFilter", 1, 10, "1", "test task").Return(int64(0), nil, assert.AnError)

		req, _ := http.NewRequest("GET", "/case-task/list?page=1&size=10&id=1&name=test task", nil)
		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		assert.Equal(t, http.StatusInternalServerError, res.Code)
		mockRepo.AssertCalled(t, "ListGoTestsWithFilter", 1, 10, "1", "test task")
	})
}
