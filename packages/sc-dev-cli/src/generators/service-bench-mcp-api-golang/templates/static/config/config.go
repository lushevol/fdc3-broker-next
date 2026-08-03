// Package config config/config.go
package config

import (
	"fmt"
	"log"
	dbutil "sampleProject/common/dbtool"
    "strconv"

	"github.com/spf13/viper"
	"gorm.io/gorm"

	"os"
)

type Config struct {
	DB   *gorm.DB
	Port int
}

func NewConfig() *Config {
	viper.SetConfigName("application")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("resources")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		panic(fmt.Errorf("fatal error reading config file: %w", err))
	}

	// query the ENV environment variable to determine the current environment
	env := os.Getenv("ENV")

	// if the specific environment configuration exists, merge it into the root configuration
	if viper.IsSet(env) {
		sub := viper.Sub(env)
		if sub != nil {
			// make dev.* or sit.* configurations "promoted" to root configuration
			// for example: dev.server.port → server.port
			viper.MergeConfigMap(sub.AllSettings())
		}
	}

    var port int

	if portStr := os.Getenv("PORT"); portStr != "" {
		var err error
		port, err = strconv.Atoi(portStr)
		if err != nil {
			log.Fatalf("not a valid port: %v", err)
		}
	} else {
		port = viper.GetInt("server.port")
	}

	dbUser := viper.GetString("database.user")
	dbSecret := viper.GetString("database.secret")
	dbHost := viper.GetString("database.host")
	dbName := viper.GetString("database.name")
	dbSchema := viper.GetString("database.schema")
	sslMode := viper.GetString("database.sslmode")

	cfg := dbutil.PrimaryDBConfig{
		Hosts:   dbHost,
		User:    dbUser,
		Secret:  dbSecret,
		DBName:  dbName,
		Schema:  dbSchema,
		SSLMode: sslMode,
	}

	// automatically connect to the primary node
	db, err := dbutil.ConnectToPrimary(cfg)
	if err != nil {
		//panic(fmt.Errorf("failed to connect to primary database: %w", err))
	}

	return &Config{
		DB:   db,
		Port: port,
	}
}
