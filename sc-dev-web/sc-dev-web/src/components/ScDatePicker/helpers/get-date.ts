import dayjs from 'dayjs/esm/index.js';
import { toUTCDate } from './to-utc-date.js';

const invalid24HourWithPm = /(([1][3-9]|2[0-3]):\d{2}:\d{2}(\sPM)?)$/i;
const pmSuffix = /\sPM$/i;
const yearFirstDateRegex = /^([+-]?\d+)-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
const dayMonthYearDateRegex = /^(\d{2})\s([A-Za-z]{3})\s([+-]?\d+)(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
const yearOnlyRegex = /^([+-]?\d+)$/;
const monthIndexMap: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
};

export const correctPartDate = (date: string) => {
    let dateCopy = date;
    if (typeof dateCopy === 'string' && invalid24HourWithPm.test(dateCopy)) {
        dateCopy = dateCopy.replace(pmSuffix, '');
    }
    return dateCopy;
};

export const getDate = (date?: Date | number | string) => {
    const dateCopy = correctPartDate(date as string);
    if (typeof dateCopy === 'string') {
        const yearOnlyMatch = dateCopy.match(yearOnlyRegex);
        if (yearOnlyMatch) {
            return toUTCDate(Number(yearOnlyMatch[1]), 0, 1);
        }

        const dayMonthYearMatch = dateCopy.match(dayMonthYearDateRegex);
        if (dayMonthYearMatch) {
            const day = Number(dayMonthYearMatch[1]);
            const month = monthIndexMap[dayMonthYearMatch[2].toLowerCase()];
            const year = Number(dayMonthYearMatch[3]);
            const hour = dayMonthYearMatch[4] !== undefined ? Number(dayMonthYearMatch[4]) : undefined;
            const minute = dayMonthYearMatch[5] !== undefined ? Number(dayMonthYearMatch[5]) : undefined;
            const second = dayMonthYearMatch[6] !== undefined ? Number(dayMonthYearMatch[6]) : undefined;

            if (
                Number.isFinite(day) &&
                Number.isFinite(month) &&
                Number.isFinite(year)
            ) {
                if (hour !== undefined && minute !== undefined) {
                    return toUTCDate(year, month, day, hour, minute, second ?? 0);
                }
                return toUTCDate(year, month, day);
            }
        }

        const match = dateCopy.match(yearFirstDateRegex);
        if (match) {
            const rawYear = match[1];
            const year = Number(rawYear);
            const month = Number(match[2]) - 1;
            const day = Number(match[3]);
            const hour = match[4] !== undefined ? Number(match[4]) : undefined;
            const minute = match[5] !== undefined ? Number(match[5]) : undefined;
            const second = match[6] !== undefined ? Number(match[6]) : undefined;

            const isSignedYear = rawYear.startsWith('+') || rawYear.startsWith('-');
            const isExtendedOrShortYear = rawYear.replace(/^[+-]/, '').length !== 4;
            const isLeadingZeroYear = !isSignedYear && !isExtendedOrShortYear && year >= 0 && year <= 99;

            if (
                Number.isFinite(year) &&
                Number.isFinite(month) &&
                Number.isFinite(day)
            ) {
                // Preserve legacy local-time parsing behavior for normal 4-digit years.
                // Use explicit UTC construction only for signed/extended/short years.
                if (!isSignedYear && !isExtendedOrShortYear && !isLeadingZeroYear) {
                    return dayjs(dateCopy).toDate();
                }

                if (hour !== undefined && minute !== undefined) {
                    return toUTCDate(year, month, day, hour, minute, second ?? 0);
                }
                return toUTCDate(year, month, day);
            }
        }
    }
    return dayjs(dateCopy).toDate();
};
