set -e

# Early out if unset.
if [ $SAMPLE_DB_SCALE == 0 ]
then
  exit 0
fi

clickhouse client --database=highlander -n <<-EOSQL
SET max_insert_threads=32;
SET max_memory_usage=2147483648;

INSERT INTO listings
SELECT
    concat('li_', toString(number)) AS id,
    toInt64(number) AS ch_id,
    concat('Listing ', toString(number)) AS title,
    NULL AS deleted
FROM
    numbers(10)
EOSQL
