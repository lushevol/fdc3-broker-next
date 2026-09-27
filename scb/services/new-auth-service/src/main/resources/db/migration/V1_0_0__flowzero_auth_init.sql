--ratan_flowzero_auth_service definition
CREATE SCHEMA IF NOT EXISTS ratan_flowzero_auth_service;

-- ratan_flowzero_auth_service.t_role definition
CREATE TABLE ratan_flowzero_auth_service.t_role (
	id bigserial NOT NULL,
	bank_id text NOT NULL,
	role_name text NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by text NOT NULL,
	updated_by text NOT NULL,
	status text NOT NULL,
	"version" int4 DEFAULT 0 NOT NULL,
	CONSTRAINT t_role_id_pkey PRIMARY KEY (id)
);
CREATE INDEX t_role_bank_id_idx ON ratan_flowzero_auth_service.t_role (bank_id);
CREATE INDEX t_role_role_name_idx ON ratan_flowzero_auth_service.t_role (role_name);


-- ratan_flowzero_auth_service.t_user definition
CREATE TABLE ratan_flowzero_auth_service.t_user (
	id bigserial NOT NULL,
	bank_id text NOT NULL,
	user_name text NULL,
	data_entitlement text NULL,
	function_entitlement text NULL,
	email text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by text NOT NULL,
	updated_by text NOT NULL,
	status text NOT NULL,
	"version" int4 DEFAULT 0 NOT NULL,
	CONSTRAINT t_user_id_pkey PRIMARY KEY (id)
);
CREATE INDEX t_user_bank_id_idx ON ratan_flowzero_auth_service.t_user (bank_id);



