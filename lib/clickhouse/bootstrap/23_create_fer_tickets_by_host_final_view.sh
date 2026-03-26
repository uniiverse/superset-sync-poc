# This implements column aliases to align with client, product and UX naming 
# used in frontend-reporting features. (eg: listing -> event, event -> timeslot)
# See: https://github.com/uniiverse/reports
set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP VIEW IF EXISTS fer_tickets_by_host_final;
CREATE VIEW IF NOT EXISTS fer_tickets_by_host_final AS
  SELECT
    id,
    state AS ticket_status,

    ticket_id AS order_id,
    ticket_state AS order_status,
    
    provider AS payment_processor,
    provider_source_type AS payment_type,
    provider_source_client AS payment_type_details,

    partner_channel_source AS channel_partner_reseller,
    channel_partner_id,

    access_key_redeemed AS access_key,
    discount_code,
    card_brand,

    rate_type AS ticket_category,
    name AS ticket_type,

    referral,
    redemption_balance,
    purchase_device_id,
    last_scanner_device_id,

    base_currency AS currency,
    
    host_id,
    listing_id AS event_id,
    event_id AS timeslot_id,

    created_at AS purchase_time,
    event_start_time AS timeslot_start_time,
    event_end_time AS timeslot_end_time,
    
    net_earnings,
    base_price AS price,
    base_voided_price AS voided_price,
    base_discount AS discount,
    base_voided_discount AS voided_discount,
    base_taxes_total AS taxes_total,
    base_voided_taxes_total AS voided_taxes_total,
    base_fees_total AS fees_total,
    base_voided_fees_total AS voided_fees_total,
    base_vat_included AS vat_included,
    base_voided_vat_included AS voided_vat_included,
    base_commission_included AS commission_included,
    base_voided_commission_included AS voided_commission_included

  FROM cost_item_cost_breakdowns_by_host_final
EOSQL
