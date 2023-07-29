import { format, getISOWeek, isSameDay, subDays } from 'date-fns';

class TimeagoUtils {
	transform(value) {
		return this.timeDifference(new Date(), new Date(typeof value === 'string' ? new Date(value) : value));
	}

	chatMessageTransform(value) {
		const date = typeof value === 'string' ? new Date(value) : value;
		const yesterday = subDays(new Date(), 1);

		if (isSameDay(date, new Date())) {
			return 'Today';
		}
		else if (isSameDay(date, yesterday)) {
			return 'Yesterday';
		}
		else if (getISOWeek(new Date()) === getISOWeek(date) || getISOWeek(new Date()) === getISOWeek(date) - 1) {
			return format(date, 'EEEE');
		}
		else {
			return format(date, 'd MMMM yyyy');
		}
	}

	dateMonthYear(value) {
		return format(typeof value === 'string' ? new Date(value) : value, 'd MMMM yyyy');
	}

	timeFormat(value) {
		return format(typeof value === 'string' ? new Date(value) : value, 'HH:mm a');
	}

	timeDifference(current, date) {
		const msPerMinute = 60 * 1000;
		const msPerHour = msPerMinute * 60;
		const msPerDay = msPerMinute * 24;
		const msPerMonth = msPerDay * 30;
		const elapsed = current.valueOf() - date.valueOf();

		if (format(current, 'yyyy') === format(date, 'yyyy')) {
			if (elapsed < msPerMinute) {
				return this.secondsAgo(elapsed);
			}
			else if (elapsed < msPerHour) {
				return this.minutesAgo(elapsed, msPerMinute);
			}
			else if (elapsed < msPerDay) {
				return this.hoursAgo(elapsed, msPerHour);
			}
			else if (elapsed < msPerMonth) {
				return this.daysAgo(date, elapsed, msPerDay);
			}
			else {
				return format(date, 'MMM d');
			}
		}
		else {
			return format(date, 'MMM d, yyyy');
		}
	}

	secondsAgo(elapsed) {
		if (Math.round(elapsed / 1000) <= 1) {
			return 'a second ago';
		}
		else {
			return `${Math.round(elapsed / 1000)} seconds ago`;
		}
	}

	minutesAgo(elapsed, msPerMinute) {
		if (Math.round(elapsed / msPerMinute) <= 1) {
			return 'a minute ago';
		}
		else {
			return `${Math.round(elapsed / msPerMinute)} minutes ago`;
		}
	}

	hoursAgo(elapsed, msPerHour) {
		if (Math.round(elapsed / msPerHour) <= 1) {
			return 'an hour ago';
		}
		else {
			return `${Math.round(elapsed / msPerHour)} hours ago`;
		}
	}

	daysAgo(date, elapsed, msPerDay) {
		if (Math.round(elapsed / msPerDay) <= 7) {
			return format(date, 'eeee');
		}
		else {
			return format(date, 'MMM d');
		}
	}
}

export const timeAgoUtils = new TimeagoUtils();