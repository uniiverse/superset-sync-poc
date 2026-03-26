set -e

# Early out if unset.
if [ $SAMPLE_DB_SCALE == 0 ]
then
  exit 0
fi

# Incremental offset of 5 minutes per row.
export OFFSET_DATE="addMinutes(makeDateTime(2022, 1, 1, 0, 0, 0, 'America/Los_Angeles'), number * 5)"

clickhouse client --database=highlander -n <<-EOSQL
SET max_insert_threads=32;
SET max_memory_usage=2147483648;

INSERT INTO events
SELECT
    concat('ev_', toString(number)) AS id,
    toInt64(number) AS ch_id,
    $OFFSET_DATE AS start_date,
    toUnixTimestamp(toString($OFFSET_DATE)) AS start_stamp,
    timeZone() AS tz,
    timeZoneOffset($OFFSET_DATE) AS utc_offset,
    NULL AS deleted
FROM
    numbers(1000000)
EOSQL
