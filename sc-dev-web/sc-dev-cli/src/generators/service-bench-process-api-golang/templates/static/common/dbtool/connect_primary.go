// Package dbutil provides utilities for database connection with primary node detection.
package dbutil

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// PrimaryDBConfig holds the configuration for connecting to a primary PostgreSQL node.
type PrimaryDBConfig struct {
	Hosts   string // e.g., "host1:5432,host2:5432"
	User    string
	Secret  string
	DBName  string
	Schema  string // optional, e.g., "public"
	SSLMode string // default: "require"
}

// ConnectToPrimary connects to the first available PRIMARY PostgreSQL node from the given hosts.
// It returns a *gorm.DB instance ready for use.
func ConnectToPrimary(cfg PrimaryDBConfig) (*gorm.DB, error) {
	// Set default SSL mode if not provided
	if cfg.SSLMode == "" {
		cfg.SSLMode = "require"
	}

	hostList := strings.Split(cfg.Hosts, ",")
	for _, hostPort := range hostList {
		hostPort = strings.TrimSpace(hostPort)
		if hostPort == "" {
			continue
		}

		// Parse host and port
		host, portStr := hostPort, "5432"
		if idx := strings.Index(hostPort, ":"); idx != -1 {
			host = hostPort[:idx]
			portStr = hostPort[idx+1:]
		}

		port, err := strconv.Atoi(portStr)
		if err != nil {
			// Skip invalid port
			fmt.Printf("[WARN] Invalid port in host %s: %v\n", hostPort, err)
			continue
		}

		// Build connection string for stdlib (database/sql)
		connStr := fmt.Sprintf(
			"host=%s port=%d user=%s secret=%s dbname=%s sslmode=%s connect_timeout=10",
			host, port, cfg.User, cfg.Secret, cfg.DBName, cfg.SSLMode,
		)
		if cfg.Schema != "" {
			connStr += " search_path=" + cfg.Schema
		}

		// Test connection using pgx directly (for pg_is_in_recovery check)
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		// Cancel context after each iteration
		defer cancel()

		pgxConfig, err := pgx.ParseConfig(connStr)
		if err != nil {
			fmt.Printf("[WARN] Failed to parse config for %s:%d: %v\n", host, port, err)
			continue
		}

		conn, err := pgx.ConnectConfig(ctx, pgxConfig)
		if err != nil {
			fmt.Printf("[WARN] Failed to connect to %s:%d: %v\n", host, port, err)
			continue
		}

		// Check if it's primary
		var isStandby bool
		err = conn.QueryRow(ctx, "SELECT pg_is_in_recovery();").Scan(&isStandby)
		conn.Close(ctx) // Close the test connection
		if cerr := conn.Close(ctx); cerr != nil {
			fmt.Printf("[WARN] Failed to close test connection for %s:%d: %v\n", host, port, cerr)
		}

		if err != nil {
			fmt.Printf("[WARN] Failed to check recovery status on %s:%d: %v\n", host, port, err)
			continue
		}

		if isStandby {
			fmt.Printf("[INFO] Skipping STANDBY node: %s:%d\n", host, port)
			continue
		}

		fmt.Printf("[INFO] Successfully connected to PRIMARY at %s:%d\n", host, port)

		// Open *sql.DB using stdlib
		sqlDB := stdlib.OpenDB(*pgxConfig)

		// Pass to GORM
		gormDB, err := gorm.Open(postgres.New(postgres.Config{
			Conn: sqlDB,
		}), &gorm.Config{})

		if err != nil {
			if cerr := sqlDB.Close(); cerr != nil {
				fmt.Printf("[WARN] Failed to close sqlDB after GORM open error: %v\n", cerr)
			}
			return nil, fmt.Errorf("failed to open GORM DB: %w", err)
		}

		return gormDB, nil
	}

	return nil, fmt.Errorf("no primary PostgreSQL node found among: %s", cfg.Hosts)
}
