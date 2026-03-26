import { Reports } from "@universe/api";
import ReportsTypesModule from "@universe/api/reports/v1/reports_types.js";
import { ServerError, Status } from "nice-grpc";

import Config from "../config/index.js";
import log from "../config/logging.js";

function convertTimestampToSeconds(timestamp: Date) {
  return timestamp.getTime() / 1000;
}

export function validateAndBuildClause(
  request: Reports.CreateGuestTokenRequest,
) {
  const filter = request.filter;
  const validatedFilters: string[] = [];

  if (!filter) {
    throw new ServerError(Status.INVALID_ARGUMENT, "Filters missing.");
  }

  // NOTE: Since reports dev data differs from dev mongo DB data, override these params.
  if (Config.BUILD_TYPE == "dev") {
    filter.userId = Config.DEV_USER_ID;
    filter.currency = "USD"; // There are three users in dev clickhouse, "us_0"/"USD", "us_1"/"CAD" and "us_2"/"EUR".
  }

  if (!filter.userId) {
    throw new ServerError(Status.INVALID_ARGUMENT, "Host ID missing.");
  }
  const hostIdClause = `host_id='${encodeURIComponent(filter.userId)}'`;
  validatedFilters.push(hostIdClause);

  // TODO: validate that it is in supported currency; it's ok for now as it is checked at the UI layer
  if (!filter.currency) {
    // TODO: Re-enable this once the client is reliably sending up currency.
    // throw new ServerError(Status.INVALID_ARGUMENT, "Currency missing.");
  } else {
    const currency = encodeURIComponent(filter.currency.toLocaleUpperCase());
    const currencyClause = `currency='${currency}'`;
    validatedFilters.push(currencyClause);
  }

  let ticketType;
  if (filter.ticketType && ReportsTypesModule?.TicketTypeFilter) {
    switch (filter.ticketType) {
      case ReportsTypesModule.TicketTypeFilter.TICKET_TYPE_FILTER_ADD_ONS:
        ticketType = "ticket_category='AddOnRate'";
        validatedFilters.push(ticketType);
        break;
      case ReportsTypesModule.TicketTypeFilter.TICKET_TYPE_FILTER_TICKETS:
        ticketType = "ticket_category!='AddOnRate'";
        validatedFilters.push(ticketType);
        break;
    }
  }

  if (filter.eventIds && filter.eventIds.length > 0) {
    const eventIds = filter.eventIds
      .map((x) => encodeURIComponent(x))
      .join("','");
    const eventIdsClause = `event_id IN ('${eventIds}')`;
    validatedFilters.push(eventIdsClause);
  }

  if (filter.exceptEventIds && filter.exceptEventIds.length > 0) {
    const eventIds = filter.exceptEventIds
      .map((x) => encodeURIComponent(x))
      .join("','");
    const eventIdsClause = `event_id NOT IN ('${eventIds}')`;
    validatedFilters.push(eventIdsClause);
  }

  // Date of Purchase
  if (filter.minPurchaseDate && filter.maxPurchaseDate) {
    if (filter.minPurchaseDate >= filter.maxPurchaseDate) {
      throw new ServerError(
        Status.INVALID_ARGUMENT,
        "minPurchaseDate is greater than maxPurchaseDate.",
      );
    }

    // TODO: Might be more efficient now to use date comparisons vs toUnixTimestamp in queries.
    const minDOP = encodeURIComponent(
      convertTimestampToSeconds(filter.minPurchaseDate),
    );
    const maxDOP = encodeURIComponent(
      convertTimestampToSeconds(filter.maxPurchaseDate),
    );
    const minAndMaxDOPClause = `toUnixTimestamp(purchase_time) >= ${minDOP} AND toUnixTimestamp(purchase_time) <= ${maxDOP}`;
    validatedFilters.push(minAndMaxDOPClause);
  }

  // Date of Attendance
  if (filter.minAttendanceDate && filter.maxAttendanceDate) {
    if (filter.minAttendanceDate >= filter.maxAttendanceDate) {
      throw new ServerError(
        Status.INVALID_ARGUMENT,
        "minAttendanceDate is greater than maxAttendanceDate.",
      );
    }

    const minDOA = encodeURIComponent(
      convertTimestampToSeconds(filter.minAttendanceDate),
    );
    const maxDOA = encodeURIComponent(
      convertTimestampToSeconds(filter.maxAttendanceDate),
    );
    const minAndMaxDOAClause = `toUnixTimestamp(timeslot_end_time) >= ${minDOA} AND toUnixTimestamp(timeslot_start_time) <= ${maxDOA}`;
    validatedFilters.push(minAndMaxDOAClause);
  }

  // For example: Any timeslots between 4:30PM and 6:30PM
  if (
    filter.minAttendanceStartTimeSecondsOfDay &&
    filter.maxAttendanceStartTimeSecondsOfDay
  ) {
    if (
      filter.minAttendanceStartTimeSecondsOfDay >=
      filter.maxAttendanceStartTimeSecondsOfDay
    ) {
      throw new ServerError(
        Status.INVALID_ARGUMENT,
        "minAttendanceStartTimeSecondsOfDay is greater than maxAttendanceStartTimeSecondsOfDay.",
      );
    }

    const minAndMaxAttendanceTimeOfDayClause = `(toUnixTimestamp(timeslot_start_time) % 86400) >= ${filter.minAttendanceStartTimeSecondsOfDay}
      AND (toUnixTimestamp(timeslot_start_time) % 86400) <= ${filter.maxAttendanceStartTimeSecondsOfDay}`;
    validatedFilters.push(minAndMaxAttendanceTimeOfDayClause);
  }

  // For example: Specific timeslot starting at 1pm and ending at 1:05pm
  // this filter would override attendance_start_time_seconds_of_day filter
  if (
    filter.exactAttendanceStartTimeSecondsOfDay &&
    filter.exactAttendanceEndTimeSecondsOfDay
  ) {
    if (
      filter.exactAttendanceStartTimeSecondsOfDay >=
      filter.exactAttendanceEndTimeSecondsOfDay
    ) {
      throw new ServerError(
        Status.INVALID_ARGUMENT,
        "exactAttendanceStartTimeSecondsOfDay is greater than exactAttendanceEndTimeSecondsOfDay.",
      );
    }

    const exactStartAndEndTimeInSecondsClause = `(toUnixTimestamp(timeslot_start_time) % 86400) = ${filter.exactAttendanceStartTimeSecondsOfDay}
      AND (toUnixTimestamp(timeslot_end_time) % 86400) = ${filter.exactAttendanceEndTimeSecondsOfDay}`;
    validatedFilters.push(exactStartAndEndTimeInSecondsClause);
  }

  const clause = validatedFilters.join(" AND ");
  log.debug(clause);
  return `(${clause})`;
}
