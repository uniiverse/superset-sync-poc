set -e
clickhouse client --database=highlander -n <<-EOSQL
CREATE TABLE IF NOT EXISTS channel_partners (
  id String,
  ch_id Int64,
  uuid Nullable(String),
  name Nullable(String),
  email Nullable(String),
  phone Nullable(String),
  note Nullable(String),
  status Nullable(String),
  tm_identifier Nullable(String)
) Engine=ReplacingMergeTree(ch_id) PRIMARY KEY id ORDER BY id;
EOSQL
