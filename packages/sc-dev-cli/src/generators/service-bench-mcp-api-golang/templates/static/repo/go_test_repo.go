package repo

import (
	"sampleProject/model"

	"gorm.io/gorm"
)

type GoTestRepository interface {
	CreateGoTest(task *model.GoTest) error
	GetGoTestByID(id string) (*model.GoTest, error)
	ListGoTests() ([]model.GoTest, error)
	UpdateGoTest(id string, name string) error
	DeleteGoTest(id string) error
	TestDBConnection() error
	ListGoTestsWithFilter(page, size int, id, name string) (total int64, data []model.GoTest, err error)
}

type GoTestRepo struct {
	db *gorm.DB
}

func NewGoTestRepo(db *gorm.DB) *GoTestRepo {
	return &GoTestRepo{db: db}
}

func (r *GoTestRepo) CreateGoTest(task *model.GoTest) error {
	return r.db.Create(task).Error
}

func (r *GoTestRepo) GetGoTestByID(id string) (*model.GoTest, error) {
	var task model.GoTest
	err := r.db.First(&task, "id = ?", id).Error
	return &task, err
}

func (r *GoTestRepo) ListGoTests() ([]model.GoTest, error) {
	var tasks []model.GoTest
	err := r.db.Find(&tasks).Error
	return tasks, err
}

func (r *GoTestRepo) UpdateGoTest(id string, name string) error {
	return r.db.Model(&model.GoTest{}).Where("id = ?", id).Updates(model.GoTest{ID: id, Name: name}).Error
}

func (r *GoTestRepo) DeleteGoTest(id string) error {
	return r.db.Delete(&model.GoTest{}, "id = ?", id).Error
}

func (r *GoTestRepo) TestDBConnection() error {
	sqlDB, err := r.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}

func (r *GoTestRepo) ListGoTestsWithFilter(page, size int, id, name string) (int64, []model.GoTest, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}
	offset := (page - 1) * size
	query := r.db.Model(&model.GoTest{})
	if id != "" {
		query = query.Where("id = ?", id)
	}
	if name != "" {
		query = query.Where("name = ?", name)
	}
	var tasks []model.GoTest
	var total int64
	query.Count(&total)
	err := query.Offset(offset).Limit(size).Find(&tasks).Error
	return total, tasks, err
}
