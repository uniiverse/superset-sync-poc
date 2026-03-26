SELECT
  cicb.id as "Ticket ID",
  FROM_UNIXTIME(e.start_stamp) as "Date attending",
  u.do_not_sell as "Do not sell information",
  l.title as "Listing name",
  cicb.listing_url as "Listing URL",
  cicb.base_price as "Ticket Sales",
  cicb.base_discount as "Disounts",
  cicb.base_fees_total as "Earnings from extra charges",
  cicb.base_taxes_total as "Total taxes collected",
  cicb.base_commission as "Universe service charge, passed to buyer",
  cicb.base_commission_included as "Universe service charge, included in price",
  cicb.base_vat as "Tax on Universe service charge, passed to buyer",
  cicb.base_vat_included as "Tax on Universe service charge, included in price",
  cicb.base_host_vat as "Tax on Universe service charge, passed to buyer, host_remitted",
  cicb.base_host_vat_included as "Tax on Universe service charge, included in price, host_remitted",
  cicb.base_voided_price as "Ticket sales (refunded)",
  cicb.base_voided_discount as "Discounts (refunded)",
  cicb.base_voided_fees_total as "Earnings from extra charges (refunded)",
  cicb.base_voided_taxes_total as "Total taxes collected (refunded)",
  cicb.base_voided_commission as "Universe service charge, passed to buyer (refunded)",
  cicb.base_voided_commission_included as "Universe service charge, included in price (refunded)",
  cicb.base_voided_vat as "Tax on Universe service charge, passed to buyer (refunded)",
  cicb.base_voided_vat_included as "Tax on Universe service charge, included in price (refunded)",
  cicb.base_voided_host_vat as "Tax on Universe service charge, passed to buyer, host remitted (refunded)",
  cicb.base_voided_host_vat_included as "Tax on Universe service charge, included in price, host remitted (refunded)",
  if(cb.status = 'lost', 0, "Net earnings") as "Net earnings",
  cicb.base_currency as "Settlement currency",
  ak.key as "Access Key applied",
  cicb.discount_code as "Discount Code",
  cicb.token as "Applied QR code",
  cicb.upgraded_to_id as "Upgraded to",
  cicb.refunded_at as "Refunded At",
  "HST",
  "Sales Tax",
  "Universe Fee",
  "Ticketmaster Processing Fee",
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Team City"
FROM (
  WITH
  host_fields.name AS hostFieldNames,
  host_fields.value AS hostFieldValues,
  taxes.name AS taxesName,
  taxes.amount AS taxesAmount,
  fees.name AS feesName,
  fees.amount AS feesAmount,
  CAST((hostFieldNames, hostFieldValues), 'Map(String, String)') as hostFieldsMap,
  CAST((taxesName, taxesAmount), 'Map(String, String)') as taxesMap,
  CAST((feesName, feesAmount), 'Map(String, String)') as feesMap
  select
    id,
    listing_id,
    event_id,
    host_id,
    ticket_id,
    listing_url,
    base_price,
    base_discount,
    base_fees_total,
    base_taxes_total,
    base_commission,
    base_commission_included,
    base_vat,
    base_vat_included,
    base_host_vat,
    base_host_vat_included,
    base_voided_price,
    base_voided_discount,
    base_voided_fees_total,
    base_voided_taxes_total,
    base_voided_commission,
    base_voided_commission_included,
    base_voided_vat,
    base_voided_vat_included,
    base_voided_host_vat,
    base_voided_host_vat_included,
    ROUND(
      base_price
    + base_discount
    + base_taxes_total
    + base_fees_total
    + base_commission_included
    + base_vat_included
    + base_host_vat
    - base_voided_price
    - base_voided_discount
    - base_voided_fees_total
    - base_voided_taxes_total
    - base_voided_commission_included
    - base_voided_vat_included
    - base_voided_host_vat, 2) as "Net earnings",
    base_currency,
    discount_code,
    token,
    refunded_at,
    upgraded_to_id,
    taxesMap['HST'] AS "HST",
    taxesMap['Sales Tax'] AS "Sales Tax",
    feesMap['Universe Fee'] AS "Universe Fee",
    feesMap['Ticketmaster Processing Fee'] AS "Ticketmaster Processing Fee",
    hostFieldsMap['First Name'] AS "First Name",
    hostFieldsMap['Last Name'] AS "Last Name",
    hostFieldsMap['Email'] AS "Email",
    hostFieldsMap['Phone Number'] as "Phone Number",
    hostFieldsMap['Enter the city that best-represents your team?'] as "Team City"
    FROM cost_item_cost_breakdowns
    FINAL
) as cicb
left join listings_final l on cicb.listing_id = l.id
left join events_final e on cicb.event_id = e.id
left join users_final u on cicb.host_id = u.id
left join access_key_redemptions_with_access_key_final ak on cicb.id = ak.cost_item_id
left join chargebacks_with_ticket_id_final cb on cicb.ticket_id = cb.ticket_id
INTO OUTFILE 'YYYY_MM_DD_TICKETS_REPORT.csv' FORMAT CSVWithNames
