ALTER TABLE IF EXISTS ONLY post_trade_portal_service.application_tile
ADD IF NOT EXISTS order_no bigint;

CREATE INDEX IF NOT EXISTS application_tile_order_no_idx
ON post_trade_portal_service.application_tile USING btree (order_no)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS ONLY post_trade_portal_service.application_tile_audit
ADD IF NOT EXISTS order_no bigint;

update post_trade_portal_service.application_tile
set order_no = application_tile_id
where application_tile_id is not null;