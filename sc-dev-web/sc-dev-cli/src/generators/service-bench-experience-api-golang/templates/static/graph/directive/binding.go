package directive

import (
	"context"
	"fmt"

	"ado.global.standardchartered.com/55313/devkit-common-logging-golang/logging"
	"github.com/99designs/gqlgen/graphql"
	"github.com/go-playground/validator/v10"
)

var (
	validate *validator.Validate
)

func init() {
	validate = validator.New()
}

func Binding(ctx context.Context, obj interface{}, next graphql.Resolver, constraint string) (interface{}, error) {
	logger := logging.NewLogUtil()
	val, err := next(ctx)
	if err != nil {
		panic(err)
	}

	err = validate.Var(val, constraint)
	if err != nil {
		logger.Warn("Validation failed: " + err.Error())
		return nil, fmt.Errorf("validation failed")
	}

	return val, nil
}
