set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP TABLE IF EXISTS listings;
CREATE TABLE IF NOT EXISTS listings (
  id String,
  ch_id Int64,
  title Nullable(String),
  deleted Nullable(Boolean)
) Engine=ReplacingMergeTree(ch_id) PRIMARY KEY id ORDER BY id;
EOSQL
