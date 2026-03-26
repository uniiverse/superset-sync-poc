set -e
clickhouse client --database=highlander -n <<-EOSQL
  CREATE VIEW IF NOT EXISTS events_final AS
  SELECT
    *
  FROM events FINAL;
EOSQL
