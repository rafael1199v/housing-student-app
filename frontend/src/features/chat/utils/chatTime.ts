const MS_PER_DAY = 86_400_000;

export function parseApiDate(iso: string): Date {
	const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(iso);
	return new Date(hasTimezone ? iso : `${iso}Z`);
}

export function formatMessageTime(iso: string, locale: string): string {
	return parseApiDate(iso).toLocaleTimeString(locale, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatListTimestamp(iso: string, locale: string): string {
	const date = parseApiDate(iso);
	const now = new Date();
	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	);
	const startOfDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const diffDays = Math.floor(
		(startOfToday.getTime() - startOfDate.getTime()) / MS_PER_DAY,
	);

	if (diffDays <= 0) {
		return date.toLocaleTimeString(locale, {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	if (diffDays < 7) {
		return date.toLocaleDateString(locale, { weekday: "short" });
	}
	return date.toLocaleDateString(locale, {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
	});
}
