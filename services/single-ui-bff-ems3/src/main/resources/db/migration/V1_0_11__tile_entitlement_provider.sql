-- Add the selected entitlement source to existing tiles; old rows remain EMS2.
-- V1_0_10 is preserved for Flyway history. Its application table is no longer a runtime route source.
ALTER TABLE post_trade_portal_service.application_tile
    ADD COLUMN provider character varying(4) NOT NULL DEFAULT 'EMS2',
    ADD COLUMN ems3_app_id text,
    ADD COLUMN ems3_app_name text,
    ADD COLUMN ems3_subject text,
    ADD CONSTRAINT application_tile_provider_valid CHECK (provider IN ('EMS2', 'EMS3')),
    ADD CONSTRAINT application_tile_ems3_binding_complete CHECK (provider <> 'EMS3' OR (
        is_template IS FALSE
        AND ems2_entities IS NOT NULL AND ems2_entities ~ '[^[:space:]]' AND position(',' IN ems2_entities) = 0
        AND ems2_subject IS NOT NULL AND ems2_subject ~ '[^[:space:]]'
        AND ems3_app_id IS NOT NULL AND ems3_app_id ~ '[^[:space:]]'
        AND ems3_app_name IS NOT NULL AND ems3_app_name ~ '[^[:space:]]'
        AND ems3_subject IS NOT NULL AND ems3_subject ~ '[^[:space:]]'
        AND ems3_app_id = btrim(ems3_app_id, E' \t\r\n')
        AND ems3_app_name = btrim(ems3_app_name, E' \t\r\n')
        AND ems3_subject = btrim(ems3_subject, E' \t\r\n')
    ));

ALTER TABLE post_trade_portal_service.application_tile_audit
    ADD COLUMN provider character varying(4) NOT NULL DEFAULT 'EMS2',
    ADD COLUMN ems3_app_id text,
    ADD COLUMN ems3_app_name text,
    ADD COLUMN ems3_subject text;

CREATE INDEX application_tile_audit_ownership_history_idx
    ON post_trade_portal_service.application_tile_audit (application_tile_id, application_tile_audit_id DESC);

-- Serialize tile changes, including direct SQL, before a deferred sibling check.
-- This also prevents two concurrent inserts from publishing different sources for one permission.
CREATE FUNCTION post_trade_portal_service.application_tile_entitlement_write_lock()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    PERFORM pg_advisory_xact_lock(hashtextextended(
        'post_trade_portal_service.application_tile_entitlement_configuration', 0));
    RETURN NULL;
END;
$$;

CREATE TRIGGER application_tile_entitlement_write_lock_trigger
    BEFORE INSERT OR UPDATE OR DELETE ON post_trade_portal_service.application_tile
    FOR EACH STATEMENT EXECUTE FUNCTION post_trade_portal_service.application_tile_entitlement_write_lock();

CREATE FUNCTION post_trade_portal_service.application_tile_entitlement_siblings_valid()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM post_trade_portal_service.application_tile AS tile
        CROSS JOIN LATERAL regexp_split_to_table(tile.ems2_entities, ',') AS entity_name
        WHERE NOT tile.is_template AND tile.ems2_subject ~ '[^[:space:]]'
            AND btrim(entity_name, E' \t\r\n') ~ '[^[:space:]]'
        GROUP BY btrim(entity_name, E' \t\r\n'), lower(btrim(tile.ems2_subject, E' \t\r\n'))
        HAVING count(DISTINCT jsonb_build_array(tile.provider,
            CASE WHEN tile.provider = 'EMS3' THEN tile.ems3_app_id END,
            CASE WHEN tile.provider = 'EMS3' THEN tile.ems3_app_name END,
            CASE WHEN tile.provider = 'EMS3' THEN tile.ems3_subject END)) > 1
    ) THEN
        RAISE EXCEPTION 'Tiles sharing a Portal entity and subject must use the same provider and EMS3 mapping'
            USING ERRCODE = '23514';
    END IF;
    RETURN NULL;
END;
$$;

-- A complete group may switch in one transaction; an incomplete group must not commit.
-- Inactive rows are checked too, so later approval cannot silently change permission ownership.
CREATE CONSTRAINT TRIGGER application_tile_entitlement_siblings_valid_trigger
    AFTER INSERT OR UPDATE OR DELETE ON post_trade_portal_service.application_tile
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION post_trade_portal_service.application_tile_entitlement_siblings_valid();
