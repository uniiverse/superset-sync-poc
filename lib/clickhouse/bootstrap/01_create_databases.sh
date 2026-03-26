set -e
clickhouse client -n <<-EOSQL
  CREATE DATABASE IF NOT EXISTS highlander;
EOSQL
