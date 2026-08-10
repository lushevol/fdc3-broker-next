update post_trade_portal_service.import_map
set ems2_role = 'RATAN_PROD'
where ems2_role = 'RATAN_ADMIN';

update post_trade_portal_service.application_category
set ems2_role = 'RATAN_PROD'
where ems2_role = 'RATAN_ADMIN';

update post_trade_portal_service.application_tile
set ems2_role = 'RATAN_PROD'
where ems2_role = 'RATAN_ADMIN';

update post_trade_portal_service.import_map
set ems2_role = 'FMO_ADMIN'
where ems2_role = 'SUPER_USER';

update post_trade_portal_service.application_category
set ems2_role = 'FMO_ADMIN'
where ems2_role = 'SUPER_USER';

update post_trade_portal_service.application_tile
set ems2_role = 'FMO_ADMIN'
where ems2_role = 'SUPER_USER';

update post_trade_portal_service.import_map
set ems2_role = 'FSS_PROD'
where ems2_role = 'FSS_ADMIN';

update post_trade_portal_service.application_category
set ems2_role = 'FSS_PROD'
where ems2_role = 'FSS_ADMIN';

update post_trade_portal_service.application_tile
set ems2_role = 'FSS_PROD'
where ems2_role = 'FSS_ADMIN';

update post_trade_portal_service.import_map
set ems2_role = 'srv.liquser.001'
where ems2_role = 'LOANIQ_ADMIN';

update post_trade_portal_service.application_category
set ems2_role = 'srv.liquser.001'
where ems2_role = 'LOANIQ_ADMIN';

update post_trade_portal_service.application_tile
set ems2_role = 'srv.liquser.001'
where ems2_role = 'LOANIQ_ADMIN';