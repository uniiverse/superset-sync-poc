set -e
clickhouse client --database=highlander -n <<-EOSQL
  CREATE VIEW IF NOT EXISTS listings_final AS
  SELECT
    *
  FROM listings FINAL;
EOSQL
