set -e
clickhouse client --database=highlander -n <<-EOSQL
  CREATE VIEW IF NOT EXISTS channel_partners_final AS
    SELECT
      *
    FROM channel_partners FINAL
EOSQL
