set -e
clickhouse client --database=highlander -n <<-EOSQL
CREATE VIEW IF NOT EXISTS chargebacks_with_ticket_id_final AS
  SELECT
    *
  FROM chargebacks_with_ticket_id FINAL
EOSQL
