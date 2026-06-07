INSERT INTO post_trade_portal_service.application_category (
    is_active,
    application_category_id,
    created_at,
    updated_at,
    created_by,
    ems2_role,
    label,
    updated_by,
    order_no
) VALUES (
    true,
    31,
    '2026-06-07 00:00:00',
    '2026-06-07 00:00:00',
    'codex',
    'RATAN_PROD',
    'Flowzero',
    'codex',
    17
) ON CONFLICT (application_category_id) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at,
    updated_by = EXCLUDED.updated_by,
    ems2_role = EXCLUDED.ems2_role,
    label = EXCLUDED.label,
    order_no = EXCLUDED.order_no;

INSERT INTO post_trade_portal_service.import_map (
    is_active,
    created_at,
    import_map_id,
    updated_at,
    created_by,
    ems2_role,
    key_name,
    path,
    updated_by
) VALUES (
    true,
    '2026-06-07 00:00:00',
    70,
    '2026-06-07 00:00:00',
    'codex',
    'RATAN_PROD',
    'flowzero',
    '/flowzero/flowzero.js',
    'codex'
) ON CONFLICT (key_name) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at,
    updated_by = EXCLUDED.updated_by,
    ems2_role = EXCLUDED.ems2_role,
    path = EXCLUDED.path;

INSERT INTO post_trade_portal_service.application_tile (
    is_active,
    is_template,
    application_category_id,
    application_tile_id,
    created_at,
    import_map_id,
    updated_at,
    ems2_entities,
    created_by,
    email_support,
    ems2_role,
    ems2_subject,
    image_dark_theme,
    image_light_theme,
    module,
    subtitle,
    tile,
    title,
    updated_by,
    order_no
) VALUES (
    true,
    false,
    31,
    101,
    '2026-06-07 00:00:00',
    70,
    '2026-06-07 00:00:00',
    'X_RATANONE',
    'codex',
    'FM_BPMS.SUPPORT@sc.com',
    'RATAN_PROD',
    'FLOWZERO',
    'darkIcons/icon01.svg',
    'lightIcons/icon01.svg',
    '/flowzero',
    '',
    '/home',
    'Flowzero',
    'codex',
    101
) ON CONFLICT (application_tile_id) DO UPDATE SET
    is_active = EXCLUDED.is_active,
    is_template = EXCLUDED.is_template,
    application_category_id = EXCLUDED.application_category_id,
    import_map_id = EXCLUDED.import_map_id,
    updated_at = EXCLUDED.updated_at,
    ems2_entities = EXCLUDED.ems2_entities,
    email_support = EXCLUDED.email_support,
    ems2_role = EXCLUDED.ems2_role,
    ems2_subject = EXCLUDED.ems2_subject,
    image_dark_theme = EXCLUDED.image_dark_theme,
    image_light_theme = EXCLUDED.image_light_theme,
    module = EXCLUDED.module,
    subtitle = EXCLUDED.subtitle,
    tile = EXCLUDED.tile,
    title = EXCLUDED.title,
    updated_by = EXCLUDED.updated_by,
    order_no = EXCLUDED.order_no;

SELECT setval(
    'post_trade_portal_service.application_category_seq',
    (select max(application_category_id) + 2 from post_trade_portal_service.application_category),
    true
);

SELECT setval(
    'post_trade_portal_service.import_map_seq',
    (select max(import_map_id) + 2 from post_trade_portal_service.import_map),
    true
);

SELECT setval(
    'post_trade_portal_service.application_tile_seq',
    (select max(application_tile_id) + 2 from post_trade_portal_service.application_tile),
    true
);
