set -e
clickhouse client --database=highlander -n <<-EOSQL
  CREATE VIEW IF NOT EXISTS cost_item_cost_breakdowns_by_host_final AS
    SELECT
      *
    FROM cost_item_cost_breakdowns_by_host FINAL
EOSQL
