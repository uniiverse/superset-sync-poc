set -e
clickhouse client --database=highlander -n <<-EOSQL
  CREATE VIEW IF NOT EXISTS users_final AS
  SELECT
    *
  FROM users FINAL;
EOSQL
