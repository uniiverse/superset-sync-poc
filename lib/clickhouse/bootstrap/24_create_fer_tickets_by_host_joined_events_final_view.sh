# This implements column aliases to align with client, product and UX naming 
# used in frontend-reporting features. (eg: listing -> event, event -> timeslot)
# See: https://github.com/uniiverse/reports
set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP VIEW IF EXISTS fer_tickets_by_host_joined_events_final;
CREATE VIEW IF NOT EXISTS fer_tickets_by_host_joined_events_final AS
  SELECT
    c.*,
    l.title AS event_name
  FROM fer_tickets_by_host_final c
  LEFT JOIN listings_final l
    ON c.event_id = l.id
EOSQL
