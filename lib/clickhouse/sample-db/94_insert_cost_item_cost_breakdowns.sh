# NOTES

# Fields evenly distributed across 10000000 cost items:
# host_id:              'us_0', 'us_1', 'us_2'
# base_currency:        'usd', 'cad', 'eur'
# buyer_id:             'us_0...99'
# event_id:             'ev_0...99999'
# ticket_id:            'ti_0...999999' (10 cost items per ticket)
# listing_id:           'li_0...9'
# access_key_redeemed:  'ak_0', 'ak_1', 'ak_2'
# card_brand:           'visa', 'mastercard', 'amex'
# discount_code:        'dc_0', 'dc_1', 'dc_2'
# net_earnings:         1.0, 0.0 (free)
# provider_source_type: 'card', 'offline'
# rate_type:            'Rate', 'AddOnRate'

set -e

# Early out if unset.
if [ $SAMPLE_DB_SCALE == 0 ]
then
  exit 0
fi

BATCH_SIZE=500000
ITERATIONS=$((SAMPLE_DB_SCALE / BATCH_SIZE))

# Incremental offset of 5 minutes per row.
export OFFSET_DATE="addMinutes(makeDateTime(2022, 1, 1, 0, 0, 0, 'America/Los_Angeles'), (number % 1000000) * 5)"

for ((i=1; i<=ITERATIONS; i++))
do
echo "Inserting cost_item_cost_breakdowns $i of $ITERATIONS ($BATCH_SIZE rows)."
clickhouse client --database=highlander -n <<-EOSQL
SET max_insert_threads=32;
SET max_memory_usage=2147483648;

INSERT INTO cost_item_cost_breakdowns
SELECT
    generateUUIDv4() AS id,
    toInt64(rand64()) AS ch_id,
    'REDEEMED_KEY' AS access_key_redeemed,
    1.0 AS base_commission,
    1.0 AS base_commission_included,
    arrayElement(['USD', 'CAD', 'EUR'], (number % 3)+1) AS base_currency,
    1.0 AS base_discount,
    1.0 AS base_fees_total,
    1.0 AS base_host_vat,
    1.0 AS base_host_vat_included,
    1.0 AS base_price,
    1.0 AS base_taxes_total,
    1.0 AS base_vat,
    NULL AS base_vat_included,
    1.0 AS base_voided_commission,
    NULL AS base_voided_commission_included,
    1.0 AS base_voided_discount,
    1.0 AS base_voided_fees_total,
    1.0 AS base_voided_host_vat,
    1.0 AS base_voided_host_vat_included,
    1.0 AS base_voided_price,
    1.0 AS base_voided_taxes_total,
    1.0 AS base_voided_vat,
    NULL AS base_voided_vat_included,
    'us_0' AS buyer_id,
    arrayElement(['visa', 'mastercard', 'amex'], (number % 3)+1) AS card_brand,
    'channel_partner_id' AS channel_partner_id,
    now() AS created_at,
    false AS deleted,
    arrayElement(['dc_0', 'dc_1', 'dc_2'], (number % 3)+1) AS discount_code,
    'email@example.com' AS email,
    concat('ev_', toString(number % 1000000)) AS event_id,
    $OFFSET_DATE AS event_start_time,
    addMinutes($OFFSET_DATE, 30) AS event_end_time,
    ['fee1', 'fee2'] AS fees_name,
    [0.5, 1.0] AS fees_amount,
    'first_name' AS first_name,
    false AS fully_refunded,
    ['field1', 'field2'] AS host_fields_name,
    ['value1', 'value2'] AS host_fields_value,
    concat('us_', toString(number % 3)) AS host_id,
    'last_four_digits' AS last_four_digits,
    'last_name' AS last_name,
    concat('li_', toString(number % 10)) AS listing_id,
    'listing_url' AS listing_url,
    'name' AS name,
    arrayElement([1.0, 0.0], (number % 2)+1) AS net_earnings,
    'option_name' AS option_name,
    false AS partially_refunded,
    'partner_channel_source' AS partner_channel_source,
    'provider' AS provider,
    'provider_source_client' AS provider_source_client,
    arrayElement(['card', 'offline'], (number % 2)+1) AS provider_source_type,
    concat('ra_', toString(number % 100)) AS rate_id,
    arrayElement(['Rate', 'AddOnRate'], (number % 2)+1) AS rate_type,
    NULL AS refunded_at,
    1.0 AS revenue,
    'paid' AS state,
    ['tax1', 'tax2'] AS taxes_name,
    [1.0, 2.0] AS taxes_amount,
    concat('ti_', toString(number % 100)) AS ticket_id,
    'paid' AS ticket_state,
    'token' AS token,
    'tz' AS tz,
    'vat_name' AS vat_name,
    '12345678' AS upgraded_to_id,
    false AS voided,
    ['field1', 'field2'] AS voided_fees_name,
    [1.0, 1.0] AS voided_fees_amount,
    ['field1', 'field2'] AS voided_taxes_name,
    [1.0, 1.0] AS voided_taxes_amount,
    'device' AS last_scanner_device_id,
    1.0 AS redemption_balance,
    'ref' AS referral,
    'p_device' AS purchase_device_id
FROM
    numbers($BATCH_SIZE)
EOSQL
done