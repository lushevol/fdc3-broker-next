package dto

type GoTestCreateRequest struct {
	ID   string `json:"id" binding:"required"`
	Name string `json:"name" binding:"required"`
}

type GoTestUpdateRequest struct {
	Name string `json:"name" binding:"required"`
}
