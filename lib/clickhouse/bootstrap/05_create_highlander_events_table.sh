set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP TABLE IF EXISTS events;
CREATE TABLE IF NOT EXISTS events (
  id String,
  ch_id Int64,
  start_date Nullable(String),
  start_stamp Nullable(Int64),
  tz Nullable(String),
  utc_offset Nullable(Int32),
  deleted Nullable(Boolean)
) Engine=ReplacingMergeTree(ch_id) PRIMARY KEY id ORDER BY id;
EOSQL
