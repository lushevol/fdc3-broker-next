CREATE FUNCTION post_trade_portal_service.authorization_subject_long_names_valid(names jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
AS $$
    SELECT CASE WHEN jsonb_typeof(names) = 'object' THEN NOT EXISTS (
        SELECT 1 FROM jsonb_each(names) AS entry
        WHERE entry.key !~ '[^[:space:]]'
            OR jsonb_typeof(entry.value) <> 'string'
            OR (entry.value #>> '{}') !~ '[^[:space:]]'
    ) ELSE false END;
$$;

CREATE TABLE post_trade_portal_service.authorization_application
(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bff_entity_name character varying(255) NOT NULL UNIQUE,
    provider character varying(4) NOT NULL DEFAULT 'EMS2',
    bff_entity_id bigint,
    ems3_app_name text,
    ems3_app_id text,
    ems3_app_uid bigint,
    ems3_itam_id text,
    subject_long_names jsonb NOT NULL DEFAULT '{}'::jsonb,
    active boolean NOT NULL DEFAULT true,
    mapping_version bigint NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL DEFAULT CURRENT_USER,
    updated_by character varying(255) NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT authorization_application_entity_nonblank
        CHECK (bff_entity_name ~ '[^[:space:]]'
            AND bff_entity_name = btrim(bff_entity_name, E' \t\r\n')),
    CONSTRAINT authorization_application_provider
        CHECK (provider IN ('EMS2', 'EMS3')),
    CONSTRAINT authorization_application_version_nonnegative
        CHECK (mapping_version >= 0),
    CONSTRAINT authorization_application_entity_id_positive
        CHECK (bff_entity_id IS NULL OR bff_entity_id > 0),
    CONSTRAINT authorization_application_app_uid_positive
        CHECK (ems3_app_uid IS NULL OR ems3_app_uid > 0),
    CONSTRAINT authorization_application_subject_names_valid
        CHECK (post_trade_portal_service.authorization_subject_long_names_valid(subject_long_names)),
    CONSTRAINT authorization_application_ems3_identity
        CHECK (provider <> 'EMS3' OR (
            bff_entity_id IS NOT NULL AND bff_entity_id > 0
            AND ems3_app_name IS NOT NULL AND ems3_app_name ~ '[^[:space:]]'
            AND ems3_app_id IS NOT NULL AND ems3_app_id ~ '[^[:space:]]'
            AND ems3_app_uid IS NOT NULL AND ems3_app_uid > 0
            AND ems3_itam_id IS NOT NULL AND ems3_itam_id ~ '[^[:space:]]'
        ))
);

CREATE UNIQUE INDEX authorization_application_ems3_app_name_unique
    ON post_trade_portal_service.authorization_application (ems3_app_name)
    WHERE active AND provider = 'EMS3';

CREATE UNIQUE INDEX authorization_application_ems3_app_uid_unique
    ON post_trade_portal_service.authorization_application (ems3_app_uid)
    WHERE active AND provider = 'EMS3';

CREATE TABLE post_trade_portal_service.authorization_application_audit
(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    authorization_application_id bigint NOT NULL,
    transaction_mode character varying(6) NOT NULL CHECK (transaction_mode IN ('INSERT', 'UPDATE', 'DELETE')),
    mapping_version bigint NOT NULL,
    changed_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by character varying(255) NOT NULL,
    database_user character varying(255) NOT NULL,
    configuration jsonb NOT NULL
);

CREATE INDEX authorization_application_audit_history_idx
    ON post_trade_portal_service.authorization_application_audit (authorization_application_id, id);

CREATE FUNCTION post_trade_portal_service.authorization_application_version_update()
RETURNS trigger LANGUAGE plpgsql
AS $$
BEGIN
    -- Hibernate supplies old + 1; direct SQL may omit the version increment.
    IF NEW.mapping_version = OLD.mapping_version THEN
        NEW.mapping_version := OLD.mapping_version + 1;
    ELSIF NEW.mapping_version <> OLD.mapping_version + 1 THEN
        RAISE EXCEPTION 'Mapping version must advance exactly once' USING ERRCODE = '23514';
    END IF;
    NEW.updated_at := clock_timestamp();
    RETURN NEW;
END;
$$;

CREATE TRIGGER authorization_application_version_update_trigger
    BEFORE UPDATE ON post_trade_portal_service.authorization_application
    FOR EACH ROW EXECUTE FUNCTION post_trade_portal_service.authorization_application_version_update();

CREATE FUNCTION post_trade_portal_service.authorization_application_audit_change()
RETURNS trigger LANGUAGE plpgsql
AS $$
DECLARE
    snapshot jsonb;
    actor character varying(255);
BEGIN
    IF TG_OP = 'DELETE' THEN
        snapshot := to_jsonb(OLD);
        actor := CURRENT_USER;
    ELSE
        snapshot := to_jsonb(NEW);
        actor := NEW.updated_by;
    END IF;
    INSERT INTO post_trade_portal_service.authorization_application_audit
        (authorization_application_id, transaction_mode, mapping_version, changed_by, database_user, configuration)
    VALUES ((snapshot->>'id')::bigint, TG_OP, (snapshot->>'mapping_version')::bigint,
        actor, CURRENT_USER, snapshot);
    RETURN NULL;
END;
$$;

CREATE TRIGGER authorization_application_audit_change_trigger
    AFTER INSERT OR UPDATE OR DELETE ON post_trade_portal_service.authorization_application
    FOR EACH ROW EXECUTE FUNCTION post_trade_portal_service.authorization_application_audit_change();

-- Route ownership includes inactive tiles so later activation has an explicit provider.
INSERT INTO post_trade_portal_service.authorization_application (bff_entity_name)
SELECT DISTINCT btrim(entity_name, E' \t\r\n')
FROM post_trade_portal_service.application_tile AS tile
CROSS JOIN LATERAL regexp_split_to_table(tile.ems2_entities, ',') AS entity_name
WHERE btrim(entity_name, E' \t\r\n') ~ '[^[:space:]]';
