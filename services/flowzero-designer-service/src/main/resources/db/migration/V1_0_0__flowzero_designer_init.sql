CREATE TABLE t_form (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(100) NOT NULL,
    form_model_url VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_by VARCHAR(20) NOT NULL,
    version int4 NOT NULL DEFAULT 0
);
CREATE TABLE t_workflow (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    country_codes VARCHAR(200) NOT NULL,
    owner_ids VARCHAR(200),
    description VARCHAR(500),
    status VARCHAR(100),
    content TEXT,
    succeed_from_id VARCHAR(20),
    business_area VARCHAR(200),
    unique_process_id VARCHAR(100) NOT NULL,
    unique_version_id VARCHAR(100),
    workflow_version INTEGER NOT NULL DEFAULT 0,
    icon VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_by VARCHAR(20) NOT NULL,
    version int4 NOT NULL DEFAULT 0
);
CREATE INDEX idx_workflow_succeed_from_id ON t_workflow (succeed_from_id);
CREATE INDEX idx_workflow_unique_process_id ON t_workflow (unique_process_id);
CREATE UNIQUE INDEX idx_workflow_unique_version_id ON t_workflow (unique_version_id);
CREATE TABLE t_field (
    id VARCHAR(20) PRIMARY KEY,
    indexed_term VARCHAR(200) NOT NULL,
    label VARCHAR(200) NOT NULL,
    ui_type VARCHAR(100),
    data_type VARCHAR(100),
    default_value VARCHAR(2000),
    data_max_length INTEGER,
    status VARCHAR(100),
    metadata JSONB,
    used_in_reporting VARCHAR(10),
    used_in_inbox_searching VARCHAR(10),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_by VARCHAR(20) NOT NULL,
    version int4 NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX idx_field_indexed_term ON t_field (indexed_term);
CREATE TABLE t_form_field_rel (
    id VARCHAR(20) PRIMARY KEY,
    form_id VARCHAR(20) NOT NULL,
    field_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_by VARCHAR(20) NOT NULL,
    version int4 NOT NULL DEFAULT 0
);
CREATE INDEX idx_form_field_rel_form_id ON t_form_field_rel (form_id);
CREATE INDEX idx_form_field_rel_field_id ON t_form_field_rel (field_id);

CREATE TABLE t_workflow_form_rel (
    id VARCHAR(20) PRIMARY KEY,
    form_id VARCHAR(20) NOT NULL,
    workflow_id VARCHAR(20) NOT NULL,
    workflow_variables JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(20) NOT NULL,
    updated_by VARCHAR(20) NOT NULL,
    version int4 NOT NULL DEFAULT 0
);


CREATE INDEX idx_workflow_form_rel_form_id ON t_workflow_form_rel (form_id);
CREATE INDEX idx_workflow_form_rel_workflow_id ON t_workflow_form_rel (workflow_id);


CREATE TABLE t_country (
	id varchar(20) NOT NULL,
	alpha2_code varchar(100) NOT NULL,
	alpha3_code varchar(100) NULL,
	numeric_code varchar(100) NOT NULL,
	short_name varchar(200) NOT NULL,
	short_name_uppercase varchar(200) NULL,
	full_name varchar(500) NULL,
	independent bool NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by varchar(20) NOT NULL,
	updated_by varchar(20) NOT NULL,
	status varchar(100) NOT NULL,
	"version" int4 DEFAULT 0 NOT NULL,
	CONSTRAINT t_country_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX t_country_alpha2_code_idx ON ratan_flowzero_designer_service.t_country USING btree (alpha2_code);
CREATE UNIQUE INDEX t_country_alpha3_code_idx ON ratan_flowzero_designer_service.t_country USING btree (alpha3_code);

INSERT INTO ratan_flowzero_designer_service.t_country
(id, alpha2_code, alpha3_code, numeric_code, short_name, short_name_uppercase, full_name, independent, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427283355455651840', 'CN', 'CHN', '156', 'China', 'CHINA', 'People''s Republic of China', true, '2026-02-11 17:32:24.218', '2026-02-11 17:32:24.218', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_country
(id, alpha2_code, alpha3_code, numeric_code, short_name, short_name_uppercase, full_name, independent, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427283414255599616', 'US', 'USA', '840', 'United States', 'UNITED STATES', 'United States of America', true, '2026-02-11 17:32:38.213', '2026-02-11 17:32:38.213', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_country
(id, alpha2_code, alpha3_code, numeric_code, short_name, short_name_uppercase, full_name, independent, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427283440478388224', 'GB', 'GBR', '826', 'United Kingdom', 'UNITED KINGDOM', 'United Kingdom of Great Britain and Northern Ireland', true, '2026-02-11 17:32:44.464', '2026-02-11 17:32:44.464', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_country
(id, alpha2_code, alpha3_code, numeric_code, short_name, short_name_uppercase, full_name, independent, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427283467678449664', 'SG', 'SGP', '702', 'Singapore', 'SINGAPORE', 'Republic of Singapore', true, '2026-02-11 17:32:50.948', '2026-02-11 17:32:50.948', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_country
(id, alpha2_code, alpha3_code, numeric_code, short_name, short_name_uppercase, full_name, independent, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427283491665674240', 'TH', 'THA', '764', 'Thailand', 'THAILAND', 'Kingdom of Thailand', true, '2026-02-11 17:32:56.667', '2026-02-11 17:32:56.667', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);

CREATE TABLE t_dictionary (
	id varchar(20) NOT NULL,
	"name" varchar(200) NOT NULL,
	"dictionary" text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by varchar(20) NOT NULL,
	updated_by varchar(20) NOT NULL,
	"version" int4 DEFAULT 0 NOT NULL,
	CONSTRAINT t_dictionary_pkey PRIMARY KEY (id)
);

CREATE INDEX t_dictionary_name_idx ON t_dictionary ("name");
INSERT INTO ratan_flowzero_designer_service.t_dictionary
(id, "name", "dictionary", created_at, updated_at, created_by, updated_by, "version")
VALUES('7427286269762908161', 'businessArea', '[{"label":"Onboarding","value":"Onboarding"},{"label":"Reference Data management","value":"Reference Data management"},{"label":"Confirmations","value":"Confirmations"},{"label":"Settlements","value":"Settlements"},{"label":"Middle Office","value":"Middle Office"},{"label":"Contracts","value":"Contracts"},{"label":"Regulatory","value":"Regulatory"}]', '2026-02-26 15:09:07.340', '2026-02-26 15:09:07.340', '8230214', '8230214', 0);


CREATE TABLE t_user (
	id varchar(20) NOT NULL,
	bank_id varchar(200) NOT NULL,
	user_name varchar(500) NULL,
	country_code varchar(100) NOT NULL,
	email varchar(200) NOT NULL,
	role_name varchar(500) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by varchar(20) NOT NULL,
	updated_by varchar(20) NOT NULL,
	status varchar(100) NOT NULL,
	"version" int4 DEFAULT 0 NOT NULL,
	CONSTRAINT t_user_pkey PRIMARY KEY (id)
);

CREATE INDEX t_user_bank_id_idx ON t_user (bank_id);
CREATE INDEX t_user_user_name_idx ON t_user (user_name);
CREATE INDEX t_user_country_code_idx ON t_user (country_code);
CREATE INDEX t_user_email_idx ON t_user (email);

INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599001444352', '2000115', 'Wang, Tech', 'CN', 'Tech.Wang@sc.com', 'CIB_MANAGEMENT_AND_GOVERNANCE', '2026-04-24 01:12:59.106', '2026-04-24 01:12:59.106', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7445331448002703360', '1401141', 'Gupta 1, Varun', 'SG', 'Varun.Gupta-1@sc.com', 'CIB_MANAGEMENT_AND_GOVERNANCE', '2026-04-02 12:49:04.872', '2026-04-02 13:56:27.578', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 2);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427263799387447291', '1490627', 'Li, Liam', 'CN', 'Liam.Li@sc.com', 'CIB_MANAGEMENT_AND_GOVERNANCE', '2026-04-10 19:42:22.818', '2026-04-10 19:42:22.818', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427263856115408896', '8229727', 'Ren, Xiangyun', 'CN', 'Xiangyun.Ren@sc.com', 'OPS_CIB_MKT_B&C_OPS_COE', '2026-02-11 16:14:55.187', '2026-02-11 16:14:55.187', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427263894749143042', '8229729', 'Zhang, Xianwei', 'CN', 'Xianwei.Zhang@sc.com', 'CIB_MANAGEMENT_AND_GOVERNANCE_DESIGNER', '2026-04-24 09:23:22.921', '2026-04-24 09:23:22.921', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7445339110887059456', '8232524', 'Wang, Qingsong', 'CN', 'Qingsong.Wang@sc.com', 'OPS_CIB_MKT_B&C_CLNT&SALE_SOL', '2026-04-02 13:19:31.746', '2026-04-02 13:19:31.746', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427263963787386880', '8228044', 'Huang, Hai', 'CN', 'Hai.Huang@sc.com', 'OPS_CIB_MKT_B&C_MIDDLE_OFFICE', '2026-02-11 16:15:20.858', '2026-02-11 16:15:20.858', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427263894749143040', '8229724', 'Zhang, Sherley', 'CN', 'Sherley.Zhang@sc.com', 'FINANCIAL_MARKETS_SALES', '2026-02-11 16:15:04.398', '2026-02-11 16:15:04.398', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_user
(id, bank_id, user_name, country_code, email, role_name, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7427263799387447296', '8230214', 'Xu, Eva', 'CN', 'Eva.Xu@sc.com', 'FINANCIAL_MARKETS_SALES', '2026-02-11 16:14:41.663', '2026-02-11 16:14:41.663', 'ratan-system-user', 'ratan-system-user', 'ACTIVE', 0);

CREATE TABLE ratan_flowzero_designer_service.t_role (
        id varchar(20) NOT NULL,
        "name" varchar(500) NOT NULL,
        description varchar(500) NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        created_by varchar(20) NOT NULL,
        updated_by varchar(20) NOT NULL,
        status varchar(100) NOT NULL,
        "version" int4 DEFAULT 0 NOT NULL,
        CONSTRAINT t_candidate_group_pkey PRIMARY KEY (id),
        CONSTRAINT t_role_unique UNIQUE (name)
);
CREATE INDEX t_candidate_group_name_idx ON ratan_flowzero_designer_service.t_role USING btree (name);

INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599202770944', 'BUSINESS_ADMIN', 'BUSINESS ADMIN who can view all the workflows/requests/tasks across the country', '2026-04-24 01:12:59.134', '2026-04-24 01:12:59.134', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599223742464', 'CIB_MANAGEMENT_AND_GOVERNANCE', 'CIB MANAGEMENT AND GOVERNANCE', '2026-04-24 01:12:59.136', '2026-04-24 01:12:59.136', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599227936768', 'CIB_MANAGEMENT_AND_GOVERNANCE_DESIGNER', 'CIB MANAGEMENT AND GOVERNANCE DESIGNER', '2026-04-24 01:12:59.137', '2026-04-24 01:12:59.137', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599236325376', 'EMS2_ADMIN', 'This role allows the user to perform IAM  role and entitlement management', '2026-04-24 01:12:59.139', '2026-04-24 01:12:59.139', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599240519680', 'FINANCIAL_MARKETS_SALES', 'FINANCIAL MARKETS SALES', '2026-04-24 01:12:59.140', '2026-04-24 01:12:59.140', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599244713984', 'OPS_CIB_MKT_B&C_CLNT&SALE_SOL', 'OPS CIB MKT B&C CLNT&SALE SOL', '2026-04-24 01:12:59.142', '2026-04-24 01:12:59.142', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599253102592', 'OPS_CIB_MKT_B&C_MIDDLE_OFFICE', 'OPS CIB MKT B&C MIDDLE OFFICE', '2026-04-24 01:12:59.143', '2026-04-24 01:12:59.143', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599257296896', 'OPS_CIB_MKT_B&C_OPS_COE', 'OPS CIB MKT B&C OPS COE', '2026-04-24 01:12:59.144', '2026-04-24 01:12:59.144', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599261491200', 'OPS_CIB_MKT_B&C_RISK_MGT_&_GOV', 'OPS CIB MKT B&C RISK MGT & GOV', '2026-04-24 01:12:59.145', '2026-04-24 01:12:59.145', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599265685504', 'OPS_CIB_MKT_COO_CONTROL', 'OPS CIB MKT COO CONTROL', '2026-04-24 01:12:59.146', '2026-04-24 01:12:59.146', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599269879808', 'OPS_CIB_MKT_COO_PLATF&TRANFM', 'OPS CIB MKT COO PLATF & TRANFM', '2026-04-24 01:12:59.147', '2026-04-24 01:12:59.147', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599274074112', 'OPS_CIB_MKT_FSS_CLNT_SOL_AME', 'OPS CIB MKT FSS CLNT SOL AME', '2026-04-24 01:12:59.148', '2026-04-24 01:12:59.148', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599278268416', 'OPS_CIB_MKT_FSS_OPS_CLNT_SOL', 'OPS CIB MKT FSS OPS CLNT SOL', '2026-04-24 01:12:59.149', '2026-04-24 01:12:59.149', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599282462720', 'OPS_CIB_MKT_FSS_OPS_CSTD&CLRNG', 'OPS CIB MKT FSS OPS CSTD&CLRNG', '2026-04-24 01:12:59.150', '2026-04-24 01:12:59.150', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599286657024', 'OPS_CIB_MKT_FSS_OPS_GROUP', 'OPS CIB MKT FSS OPS GROUP', '2026-04-24 01:12:59.151', '2026-04-24 01:12:59.151', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599290851328', 'OPS_CIB_MKT_FSS_OPS_R&C', 'OPS CIB MKT FSS OPS R&C', '2026-04-24 01:12:59.152', '2026-04-24 01:12:59.152', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599295045632', 'OPS_CIB_MKT_FSS_OPS_SHRD_SERV', 'OPS CIB MKT FSS OPS SHRD SERV', '2026-04-24 01:12:59.153', '2026-04-24 01:12:59.153', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599299239936', 'OPS_CIB_MKT_FSS_OPS_TRANSF', 'OPS CIB MKT FSS OPS TRANSF', '2026-04-24 01:12:59.154', '2026-04-24 01:12:59.154', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599303434240', 'OPS_CIB_MKT_OPS_CIB_MKT_SEC', 'OPS CIB MKT OPS CIB MKT SEC', '2026-04-24 01:12:59.155', '2026-04-24 01:12:59.155', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599307628544', 'OPS_CIB_MKT_OPS_CONFIRM', 'OPS CIB MKT OPS CONFIRM', '2026-04-24 01:12:59.156', '2026-04-24 01:12:59.156', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599307628545', 'OPS_CIB_MKT_OPS_DATA_MGMT', 'OPS CIB MKT OPS DATA MGMT', '2026-04-24 01:12:59.157', '2026-04-24 01:12:59.157', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599311822848', 'OPS_CIB_MKT_OPS_DERIV_SETT', 'OPS CIB MKT OPS DERIV SETT', '2026-04-24 01:12:59.157', '2026-04-24 01:12:59.157', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599316017152', 'OPS_CIB_MKT_OPS_MARGIN_OPS', 'OPS CIB MKT OPS MARGIN OPS', '2026-04-24 01:12:59.158', '2026-04-24 01:12:59.158', '2000115', '2000115', 'ACTIVE', 0);
INSERT INTO ratan_flowzero_designer_service.t_role
(id, "name", description, created_at, updated_at, created_by, updated_by, status, "version")
VALUES('7453249599320211456', 'OPS_CIB_MKT_OTC_CLRG&PRIM', 'OPS CIB MKT OTC CLRG & PRIM', '2026-04-24 01:12:59.159', '2026-04-24 01:12:59.159', '2000115', '2000115', 'ACTIVE', 0);