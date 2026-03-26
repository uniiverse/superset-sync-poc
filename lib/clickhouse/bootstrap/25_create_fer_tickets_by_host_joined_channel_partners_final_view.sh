# This implements column aliases to align with client, product and UX naming 
# used in frontend-reporting features. (eg: listing -> event, event -> timeslot)
# See: https://github.com/uniiverse/reports
set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP VIEW IF EXISTS fer_tickets_by_host_joined_channel_partners_final;
CREATE VIEW IF NOT EXISTS fer_tickets_by_host_joined_channel_partners_final AS
  SELECT
    c.*,
    cp.name AS channel_partner
  FROM fer_tickets_by_host_final c
  LEFT JOIN channel_partners_final cp
    ON c.channel_partner_id = cp.id
EOSQL
