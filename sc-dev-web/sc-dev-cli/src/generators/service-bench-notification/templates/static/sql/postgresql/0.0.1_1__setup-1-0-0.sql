CREATE TABLE sb_notification.sb_notification_request (
	id varchar(40) NOT NULL,
	detail text NULL,
	status varchar(50) NOT NULL,
	"result" jsonb NULL,
	schedule_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	created_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	updated_date timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	"version" int4 NULL DEFAULT 0,
	times int4 NULL DEFAULT 0,
	CONSTRAINT notification_request_pkey PRIMARY KEY (id)
);
CREATE INDEX request_schedule_idx ON sb_notification.notification_request USING btree (status, schedule_date);
CREATE INDEX request_times_idx ON sb_notification.notification_request USING btree (status, times,created_date);

CREATE TABLE sb_notification.sb_distributed_lock (
	id varchar(40) NOT NULL,
	lock_key varchar(64) NOT NULL,
	"token" varchar(64) NULL,
	created_on timestamp NULL,
	valid_till timestamp NULL,
	CONSTRAINT distributed_lock_lock_key_key UNIQUE (lock_key)
);