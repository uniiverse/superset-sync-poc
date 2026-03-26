set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id String,
  ch_id Int64,
  do_not_sell Nullable(Boolean),
  deleted Nullable(Boolean)
) Engine=ReplacingMergeTree(ch_id) PRIMARY KEY id ORDER BY id;
EOSQL
