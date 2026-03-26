set -e
clickhouse client --database=highlander -n <<-EOSQL
  DROP TABLE IF EXISTS cost_item_cost_breakdowns_by_listing;
  CREATE MATERIALIZED VIEW IF NOT EXISTS cost_item_cost_breakdowns_by_listing
  ENGINE = ReplacingMergeTree(ch_id)
  PRIMARY KEY (listing_id, id)
  ORDER BY (listing_id, id)
  SETTINGS allow_nullable_key=true
  POPULATE
  AS SELECT * FROM cost_item_cost_breakdowns;
EOSQL
