CREATE SEQUENCE IF NOT EXISTS post_trade_portal_service.application_category_audit_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE IF NOT EXISTS post_trade_portal_service.application_category_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE IF NOT EXISTS post_trade_portal_service.application_tile_audit_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE IF NOT EXISTS post_trade_portal_service.application_tile_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE IF NOT EXISTS post_trade_portal_service.import_map_audit_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE IF NOT EXISTS post_trade_portal_service.import_map_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;



CREATE TABLE IF NOT EXISTS post_trade_portal_service.import_map
(
    is_active boolean NOT NULL,
    created_at timestamp(6) without time zone,
    import_map_id bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    created_by character varying(255) COLLATE pg_catalog."default",
    ems2_role character varying(255) COLLATE pg_catalog."default" NOT NULL,
    key_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    path character varying(255) COLLATE pg_catalog."default" NOT NULL,
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT import_map_pkey PRIMARY KEY (import_map_id),
    CONSTRAINT import_map_key_name_key UNIQUE (key_name)
)
TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS post_trade_portal_service.import_map_audit
(
    is_active boolean NOT NULL,
    created_at timestamp(6) without time zone,
    import_map_audit_id bigint NOT NULL,
    import_map_id bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    created_by character varying(255) COLLATE pg_catalog."default",
    ems2_role character varying(255) COLLATE pg_catalog."default",
    key_name character varying(255) COLLATE pg_catalog."default",
    path character varying(255) COLLATE pg_catalog."default",
    transaction_mode character varying(255) COLLATE pg_catalog."default",
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT import_map_audit_pkey PRIMARY KEY (import_map_audit_id)
)
TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS import_map_audit_s_idx
ON post_trade_portal_service.import_map_audit USING btree (import_map_id, updated_at)
TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS post_trade_portal_service.application_category
(
    is_active boolean NOT NULL,
    application_category_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    created_by character varying(255) COLLATE pg_catalog."default" NOT NULL,
    ems2_role character varying(255) COLLATE pg_catalog."default" NOT NULL,
    label character varying(255) COLLATE pg_catalog."default" NOT NULL,
    updated_by character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT application_category_pkey PRIMARY KEY (application_category_id),
    CONSTRAINT application_category_label_key UNIQUE (label)
)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS post_trade_portal_service.application_category_audit
(
    is_active boolean NOT NULL,
    application_category_audit_id bigint NOT NULL,
    application_category_id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by character varying(255) COLLATE pg_catalog."default",
    ems2_role character varying(255) COLLATE pg_catalog."default",
    label character varying(255) COLLATE pg_catalog."default",
    transaction_mode character varying(255) COLLATE pg_catalog."default",
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT application_category_audit_pkey PRIMARY KEY (application_category_audit_id)
)
TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS application_category_audit_s_idx
ON post_trade_portal_service.application_category_audit USING btree (application_category_id, updated_at)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS post_trade_portal_service.application_tile
(
    is_active boolean NOT NULL,
    is_template boolean NOT NULL,
    application_category_id bigint,
    application_tile_id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    import_map_id bigint,
    updated_at timestamp(6) without time zone,
    ems2_entities character varying(32000) COLLATE pg_catalog."default" NOT NULL,
    created_by character varying(255) COLLATE pg_catalog."default",
    email_support character varying(255) COLLATE pg_catalog."default",
    ems2_role character varying(255) COLLATE pg_catalog."default" NOT NULL,
    ems2_subject character varying(255) COLLATE pg_catalog."default" NOT NULL,
    image_dark_theme character varying(255) COLLATE pg_catalog."default",
    image_light_theme character varying(255) COLLATE pg_catalog."default",
    module character varying(255) COLLATE pg_catalog."default" NOT NULL,
    subtitle character varying(255) COLLATE pg_catalog."default",
    tile character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT application_tile_pkey PRIMARY KEY (application_tile_id),
    CONSTRAINT fkoiqx1urybxjewspq831fuooro FOREIGN KEY (application_category_id)
        REFERENCES post_trade_portal_service.application_category (application_category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkpoogfscu1hsh341s1p4f2vlac FOREIGN KEY (import_map_id)
        REFERENCES post_trade_portal_service.import_map (import_map_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS post_trade_portal_service.application_tile_audit
(
    is_active boolean NOT NULL,
    is_template boolean NOT NULL,
    application_category_id bigint,
    application_tile_audit_id bigint NOT NULL,
    application_tile_id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    import_map_id bigint,
    updated_at timestamp(6) without time zone,
    ems2_entities character varying(32000) COLLATE pg_catalog."default",
    created_by character varying(255) COLLATE pg_catalog."default",
    email_support character varying(255) COLLATE pg_catalog."default",
    ems2_role character varying(255) COLLATE pg_catalog."default",
    ems2_subject character varying(255) COLLATE pg_catalog."default",
    image_dark_theme character varying(255) COLLATE pg_catalog."default",
    image_light_theme character varying(255) COLLATE pg_catalog."default",
    module character varying(255) COLLATE pg_catalog."default",
    subtitle character varying(255) COLLATE pg_catalog."default",
    tile character varying(255) COLLATE pg_catalog."default",
    title character varying(255) COLLATE pg_catalog."default",
    transaction_mode character varying(255) COLLATE pg_catalog."default",
    updated_by character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT application_tile_audit_pkey PRIMARY KEY (application_tile_audit_id),
    CONSTRAINT fkf3b5hokegoi8i7er48jfpsfs0 FOREIGN KEY (application_category_id)
        REFERENCES post_trade_portal_service.application_category (application_category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkkkuhv88d3954clacpmrkl29fm FOREIGN KEY (import_map_id)
        REFERENCES post_trade_portal_service.import_map (import_map_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS application_tile_audit_s_idx
ON post_trade_portal_service.application_tile_audit USING btree (application_tile_id, updated_at)
TABLESPACE pg_default;

-- grant privileges to ratanone_dmp

GRANT USAGE ON SCHEMA post_trade_portal_service TO ratanone_dmp;
GRANT SELECT ON ALL TABLES IN SCHEMA post_trade_portal_service TO ratanone_dmp;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA post_trade_portal_service TO ratanone_dmp;

ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT SELECT ON TABLES TO ratanone_dmp;
ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT SELECT ON SEQUENCES TO ratanone_dmp;

-- grant privileges to ratanprd_002

GRANT USAGE ON SCHEMA post_trade_portal_service TO ratanprd_002;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA post_trade_portal_service TO ratanprd_002;
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA post_trade_portal_service TO ratanprd_002;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA post_trade_portal_service TO ratanprd_002;

ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE ON TABLES TO ratanprd_002;
ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT SELECT,UPDATE ON SEQUENCES TO ratanprd_002;
ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT EXECUTE ON FUNCTIONS  TO ratanprd_002;

-- grant privileges to psssupport

GRANT USAGE ON SCHEMA post_trade_portal_service TO psssupport;
GRANT SELECT ON ALL TABLES IN SCHEMA post_trade_portal_service TO psssupport;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA post_trade_portal_service TO psssupport;

ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT SELECT ON TABLES TO psssupport;
ALTER DEFAULT PRIVILEGES IN SCHEMA post_trade_portal_service GRANT SELECT ON SEQUENCES TO psssupport;