package test

import (
	_ "database/sql"
	"testing"

	"sampleProject/model"
	"sampleProject/repo"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupTestRepo(t *testing.T) (*repo.GoTestRepo, sqlmock.Sqlmock) {
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	dialector := postgres.New(postgres.Config{
		Conn: mockDB,
	})
	db, err := gorm.Open(dialector, &gorm.Config{})
	assert.NoError(t, err)
	return repo.NewGoTestRepo(db), mock
}

func TestCreateAndGetGoTest(t *testing.T) {
	r, mock := setupTestRepo(t)
	task := &model.GoTest{ID: "1", Name: "test"}
	// mock insert
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	// mock select
	rows := sqlmock.NewRows([]string{"id", "name"}).AddRow("1", "test")
	mock.ExpectQuery(`SELECT \* FROM "go_test" WHERE id = \$1 ORDER BY "go_test"."id" LIMIT \$2`).WillReturnRows(rows)

	err := r.CreateGoTest(task)
	assert.NoError(t, err)
	got, err := r.GetGoTestByID("1")
	assert.NoError(t, err)
	assert.Equal(t, "test", got.Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestListGoTests(t *testing.T) {
	r, mock := setupTestRepo(t)
	// mock insert
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(2, 1))
	mock.ExpectCommit()
	// mock select all
	rows := sqlmock.NewRows([]string{"id", "name"}).AddRow("1", "a").AddRow("2", "b")
	mock.ExpectQuery(`SELECT \* FROM "go_test"`).WillReturnRows(rows)

	r.CreateGoTest(&model.GoTest{ID: "1", Name: "a"})
	r.CreateGoTest(&model.GoTest{ID: "2", Name: "b"})
	list, err := r.ListGoTests()
	assert.NoError(t, err)
	assert.Len(t, list, 2)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestUpdateGoTest(t *testing.T) {
	r, mock := setupTestRepo(t)
	// mock insert
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	// mock update
	mock.ExpectBegin()
	mock.ExpectExec(`UPDATE "go_test" SET.*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	// mock select
	rows := sqlmock.NewRows([]string{"id", "name"}).AddRow("1", "b")
	mock.ExpectQuery(`SELECT \* FROM "go_test" WHERE id = \$1 ORDER BY "go_test"."id" LIMIT \$2`).WillReturnRows(rows)

	r.CreateGoTest(&model.GoTest{ID: "1", Name: "a"})
	err := r.UpdateGoTest("1", "b")
	assert.NoError(t, err)
	got, _ := r.GetGoTestByID("1")
	assert.Equal(t, "b", got.Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDeleteGoTest(t *testing.T) {
	r, mock := setupTestRepo(t)
	// mock insert
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	// mock delete
	mock.ExpectBegin()
	mock.ExpectExec(`DELETE FROM "go_test" WHERE.*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	// mock select (not found)
	mock.ExpectQuery(`SELECT \* FROM "go_test" WHERE id = \$1 ORDER BY "go_test"."id" LIMIT \$2`).WillReturnRows(sqlmock.NewRows([]string{"id", "name"}))

	r.CreateGoTest(&model.GoTest{ID: "1", Name: "a"})
	err := r.DeleteGoTest("1")
	assert.NoError(t, err)
	_, err = r.GetGoTestByID("1")
	assert.Error(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestListGoTestsWithFilter(t *testing.T) {
	r, mock := setupTestRepo(t)
	// mock insert
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "go_test".*`).WillReturnResult(sqlmock.NewResult(2, 1))
	mock.ExpectCommit()
	// mock count
	mock.ExpectQuery(`SELECT count\(\*\) FROM "go_test" WHERE id = \$1 AND name = \$2`).WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))
	// mock select with filter
	rows := sqlmock.NewRows([]string{"id", "name"}).AddRow("1", "a")
	mock.ExpectQuery(`SELECT \* FROM "go_test" WHERE id = \$1 AND name = \$2 LIMIT \$3`).WillReturnRows(rows)

	r.CreateGoTest(&model.GoTest{ID: "1", Name: "a"})
	r.CreateGoTest(&model.GoTest{ID: "2", Name: "b"})
	total, list, err := r.ListGoTestsWithFilter(1, 1, "1", "a")
	assert.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Len(t, list, 1)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestTestDBConnection(t *testing.T) {
	r, _ := setupTestRepo(t)
	err := r.TestDBConnection()
	assert.NoError(t, err)
}
