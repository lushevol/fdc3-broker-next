ALTER TABLE IF EXISTS ONLY post_trade_portal_service.application_category
ADD IF NOT EXISTS order_no bigint;

CREATE INDEX IF NOT EXISTS application_category_order_no_idx
ON post_trade_portal_service.application_category USING btree (order_no)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS ONLY post_trade_portal_service.application_category_audit
ADD IF NOT EXISTS order_no bigint;

update post_trade_portal_service.application_category
set order_no = 3
where application_category_id = 15;

update post_trade_portal_service.application_category
set order_no = 4
where application_category_id = 9;

update post_trade_portal_service.application_category
set order_no = 5
where application_category_id = 4;

update post_trade_portal_service.application_category
set order_no = 6
where application_category_id = 8;

update post_trade_portal_service.application_category
set order_no = 7
where application_category_id = 11;

update post_trade_portal_service.application_category
set order_no = 8
where application_category_id = 13;

update post_trade_portal_service.application_category
set order_no = 9
where application_category_id = 7;

update post_trade_portal_service.application_category
set order_no = 10
where application_category_id = 5;

update post_trade_portal_service.application_category
set order_no = 11
where application_category_id = 12;

update post_trade_portal_service.application_category
set order_no = application_category_id
where order_no is null and application_category_id is not null;

update post_trade_portal_service.application_category
set order_no = 12
where application_category_id = 6;

update post_trade_portal_service.application_category
set order_no = 13
where application_category_id = 10;

update post_trade_portal_service.application_category
set order_no = 15
where application_category_id = 3;

update post_trade_portal_service.application_category
set order_no = 16
where application_category_id = 30;

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/trade.dark.svg', image_light_theme = 'lightIcons/trade.light.svg'
where application_tile_id = 54;

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/cashflow.dark.svg', image_light_theme = 'lightIcons/cashflow.light.svg'
where application_tile_id in (36, 38, 39);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/cn.settlement.dark.svg', image_light_theme = 'lightIcons/cn.settlement.light.svg'
where application_tile_id = 37;


update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/settlment.exception.dark.svg', image_light_theme = 'lightIcons/settlment.exception.light.svg'
where application_tile_id in (15, 17);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/exception.dark.svg', image_light_theme = 'lightIcons/exception.light.svg'
where application_tile_id in (16, 18);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/rules.dark.svg', image_light_theme = 'lightIcons/rules.light.svg'
where application_tile_id in (30, 31, 35, 50, 51, 52);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/icon09.svg', image_light_theme = 'lightIcons/icon09.svg'
where application_tile_id in (29);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/suppression.rules.svg', image_light_theme = 'lightIcons/suppression.rules.svg'
where application_tile_id in (32, 33, 34);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/icon01.svg', image_light_theme = 'lightIcons/icon01.svg'
where application_tile_id in (19,20,21,22,23,24,25,26,96,100,43,48);

update post_trade_portal_service.application_tile
set image_dark_theme = 'darkIcons/icon02.svg', image_light_theme = 'lightIcons/icon02.svg'
where application_tile_id in (44,45,46,47,49);
