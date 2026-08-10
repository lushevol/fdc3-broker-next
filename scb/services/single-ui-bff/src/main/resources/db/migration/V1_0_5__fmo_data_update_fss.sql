delete from post_trade_portal_service.import_map_audit where import_map_id in (58, 60);
delete from post_trade_portal_service.import_map where import_map_id in (58, 60);
INSERT INTO post_trade_portal_service.import_map (is_active, created_at, import_map_id, updated_at, created_by, ems2_role, key_name, path, updated_by) VALUES (true, '2025-02-06 12:13:39.889', 58, '2025-02-12 06:45:52.354', '2015399', 'FSS_PROD', 'fss_billing_evat', '/fss_billing_evat/fssservices_tiles.js', 'FMO Portal Service');
INSERT INTO post_trade_portal_service.import_map (is_active, created_at, import_map_id, updated_at, created_by, ems2_role, key_name, path, updated_by) VALUES (true, '2025-02-12 08:53:32.25', 60, '2025-02-12 08:57:56.527', '2015399', 'FSS_PROD', 'fss_mosaic', '/fss_mosaic/fssservices_tiles.js', '1606194');

SELECT setval('post_trade_portal_service.import_map_seq', (select max(import_map_id)+2 from post_trade_portal_service.import_map), true);

SELECT setval('post_trade_portal_service.application_category_seq', (select max(application_category_id)+2 from post_trade_portal_service.application_category), true);

delete from post_trade_portal_service.application_tile_audit where application_tile_id in (74, 98, 100);
delete from post_trade_portal_service.application_tile where application_tile_id in (74, 98, 100);
INSERT INTO post_trade_portal_service.application_tile (is_active, is_template, application_category_id, application_tile_id, created_at, import_map_id, updated_at, ems2_entities, created_by, email_support, ems2_role, ems2_subject, image_dark_theme, image_light_theme, module, subtitle, tile, title, updated_by) VALUES (true, false, 5, 98, '2025-02-06 12:16:05.579', 24, '2025-02-12 06:45:52.478', 'FSSBI_EVAT_GH', '2015399', 'FM_BPMS.SUPPORT@sc.com', 'FSS_PROD', 'FSS Billing EVAT', 'darkIcons/icon11.svg', 'lightIcons/icon11.svg', 'fss_billing_evat', '', 'billing-evat', 'Billing - EVAT', 'FMO Portal Service');
INSERT INTO post_trade_portal_service.application_tile (is_active, is_template, application_category_id, application_tile_id, created_at, import_map_id, updated_at, ems2_entities, created_by, email_support, ems2_role, ems2_subject, image_dark_theme, image_light_theme, module, subtitle, tile, title, updated_by) VALUES (true, false, 5, 100, '2025-02-12 08:55:35.082', 24, '2025-02-12 08:58:20.748', 'FSS_MOSAIC_TH, FSS_MOSAIC_CN, FSS_MOSAIC_PH, FSS_MOSAIC_ZA, FSS_MOSAIC_SA', '2015399', 'FM_BPMS.SUPPORT@sc.com', 'FSS_PROD', 'FSS Services Mosaic', 'darkIcons/icon11.svg', 'lightIcons/icon11.svg', 'fss_mosaic', '', 'fssMosaic', 'FSS Mosaic', '1606194');
INSERT INTO post_trade_portal_service.application_tile (is_active, is_template, application_category_id, application_tile_id, created_at, import_map_id, updated_at, ems2_entities, created_by, email_support, ems2_role, ems2_subject, image_dark_theme, image_light_theme, module, subtitle, tile, title, updated_by) VALUES (true, false, 6, 74, '2025-01-06 13:08:55.09', 27, '2025-02-04 16:25:30.366', 'LoanIQIL_UI', '2001208', '', 'srv.liquser.001', '/LoanIQIL_UI', 'darkIcons/icon11.svg', 'lightIcons/icon11.svg', 'template', '', 'LoanIQIL_UI', 'LoanIQ UI', '2001208');

update post_trade_portal_service.application_tile
set ems2_entities = 'FSSPS_REFERENCE_CN, FSSPS_REFERENCE_ID, FSSPS_REFERENCE_GH'
where application_tile_id = 21;

SELECT setval('post_trade_portal_service.application_tile_seq', (select max(application_tile_id)+2 from post_trade_portal_service.application_tile), true);


