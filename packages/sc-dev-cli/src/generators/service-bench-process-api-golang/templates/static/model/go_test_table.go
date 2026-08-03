package model

type GoTest struct {
	ID   string `gorm:"size:36"`
	Name string `gorm:"size:255;"`
}

func (GoTest) TableName() string {
	return "go_test"
}
