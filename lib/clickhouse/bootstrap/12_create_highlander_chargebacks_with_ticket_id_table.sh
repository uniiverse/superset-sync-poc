set -e
clickhouse client --database=highlander -n <<-EOSQL
CREATE TABLE IF NOT EXISTS chargebacks_with_ticket_id (
  dp_id String,
  ch_id Int64,
  ticket_id Nullable(String),
  status Nullable(String),
  deleted Nullable(Boolean)
) Engine=ReplacingMergeTree(ch_id) PRIMARY KEY dp_id ORDER BY dp_id;
EOSQL
