package test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"

	"devkit/go-exp-api/graph"
	"github.com/stretchr/testify/require"
)

func Test_queryResolver(t *testing.T) {
	t.Run("should get sample", func(t *testing.T) {
		resolvers := graph.Resolver{}
		testClient := client.New(handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &resolvers})))
		query := `query { get_sample { name description } }`
		var response struct {
			Get_sample struct {
				Name        string
				Description string
			}
		}

		testClient.MustPost(query, &response)
		require.Equal(t, "Sample Name", response.Get_sample.Name)
		require.Equal(t, "This is a sample description.", response.Get_sample.Description)
	})
}
