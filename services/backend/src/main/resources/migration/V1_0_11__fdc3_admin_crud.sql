CREATE TABLE IF NOT EXISTS post_trade_portal_service.fdc3_declaration
(
    app_id character varying(255) NOT NULL,
    interop_json text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by character varying(255),
    ems2_role character varying(255) NOT NULL,
    updated_by character varying(255),
    CONSTRAINT fdc3_declaration_pkey PRIMARY KEY (app_id)
);

CREATE INDEX IF NOT EXISTS fdc3_declaration_role_active_idx
ON post_trade_portal_service.fdc3_declaration USING btree (ems2_role, is_active, updated_at);
