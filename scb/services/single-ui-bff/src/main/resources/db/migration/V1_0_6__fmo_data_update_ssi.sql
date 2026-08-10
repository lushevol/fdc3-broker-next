do $$
declare
 SSIPLUS_PROD varchar(50) := 'SSIPLUS_PROD';
 SSI_ADMIN varchar(50) := 'SSI_ADMIN';
 FMO_PORTAL_SERVICE varchar(50) := 'FMO_PORTAL_SERVICE';
 NOW_TIME timestamp  := current_timestamp;
begin

update post_trade_portal_service.import_map
set ems2_role = SSIPLUS_PROD
where ems2_role = SSI_ADMIN;

update post_trade_portal_service.application_category
set ems2_role = SSIPLUS_PROD
where ems2_role = SSI_ADMIN;

update post_trade_portal_service.application_tile
set ems2_role = SSIPLUS_PROD
where ems2_role = SSI_ADMIN;


update post_trade_portal_service.import_map
set updated_by = FMO_PORTAL_SERVICE, created_by = FMO_PORTAL_SERVICE, updated_at = NOW_TIME, created_at = NOW_TIME
where updated_by is not null and created_by is not null;

update post_trade_portal_service.application_category
set updated_by = FMO_PORTAL_SERVICE, created_by = FMO_PORTAL_SERVICE, updated_at = NOW_TIME, created_at = NOW_TIME
where updated_by is not null and created_by is not null;


update post_trade_portal_service.application_tile
set updated_by = FMO_PORTAL_SERVICE, created_by = FMO_PORTAL_SERVICE, updated_at = NOW_TIME, created_at = NOW_TIME
where updated_by is not null and created_by is not null;

end; $$;
