set -e
clickhouse client --database=highlander -n <<-EOSQL
DROP TABLE IF EXISTS cost_item_cost_breakdowns;
CREATE TABLE IF NOT EXISTS cost_item_cost_breakdowns (
  id String,
  ch_id Int64,
  access_key_redeemed Nullable(String),
  base_commission Nullable(Float32),
  base_commission_included Nullable(Float32),
  base_currency Nullable(String),
  base_discount Nullable(Float32),
  base_fees_total Nullable(Float32),
  base_host_vat Nullable(Float32),
  base_host_vat_included Nullable(Float32),
  base_price Nullable(Float32),
  base_taxes_total Nullable(Float32),
  base_vat Nullable(Float32),
  base_vat_included Nullable(Float32),
  base_voided_commission Nullable(Float32),
  base_voided_commission_included Nullable(Float32),
  base_voided_discount Nullable(Float32),
  base_voided_fees_total Nullable(Float32),
  base_voided_host_vat Nullable(Float32),
  base_voided_host_vat_included Nullable(Float32),
  base_voided_price Nullable(Float32),
  base_voided_taxes_total Nullable(Float32),
  base_voided_vat Nullable(Float32),
  base_voided_vat_included Nullable(Float32),
  buyer_id Nullable(String),
  card_brand Nullable(String),
  channel_partner_id Nullable(String),
  created_at Nullable(DateTime),
  deleted Nullable(Boolean),
  discount_code Nullable(String),
  email Nullable(String),
  event_id Nullable(String),
  event_end_time Nullable(DateTime),
  event_start_time Nullable(DateTime),
  fees Nested
      (
          name Nullable(String),
          amount Nullable(String)
      ),
  first_name Nullable(String),
  fully_refunded Nullable(Boolean),
  host_fields Nested
      (
          name Nullable(String),
          value Nullable(String)
      ),
  host_id Nullable(String),
  last_four_digits Nullable(String),
  last_name Nullable(String),
  listing_id Nullable(String),
  listing_url Nullable(String),
  name Nullable(String),
  net_earnings Nullable(Float32),
  option_name Nullable(String),
  partially_refunded Nullable(Boolean),
  partner_channel_source Nullable(String),
  provider Nullable(String),
  provider_source_client Nullable(String),
  provider_source_type Nullable(String),
  rate_id Nullable(String),
  rate_type Nullable(String),
  refunded_at Nullable(DateTime),
  revenue Nullable(Float32),
  state Nullable(Enum(
      'cancelled' = 1,
      'closed' = 2,
      'declined' = 3,
      'ended' = 4,
      'error' = 5,
      'expired' = 6,
      'failed' = 7,
      'paid' = 8,
      'partially_paid' = 9,
      'transferred' = 10,
      'unapproved' = 11,
      'unpaid' = 12,
      'upgraded' = 13,
      'pending' = 14,
      'partailly_paid' = 15,
      'disputed' = 16,
      'unauthorized' = 17
    )),
  taxes Nested
      (
          name Nullable(String),
          amount Nullable(String)
      ),

  ticket_id Nullable(String),
  ticket_state Nullable(String),
  token Nullable(String),
  tz Nullable(String),
  vat_name Nullable(String),
  upgraded_to_id Nullable(String),
  voided Nullable(Boolean),
  voided_fees Nested
      (
          name Nullable(String),
          amount Nullable(String)
      ),
  voided_taxes Nested
      (
          name Nullable(String),
          amount Nullable(String)
      ),
  last_scanner_device_id Nullable(String),
  redemption_balance Nullable(Int32),
  referral Nullable(String),
  purchase_device_id Nullable(String)
) Engine=ReplacingMergeTree(ch_id) PRIMARY KEY id ORDER BY id;
EOSQL
