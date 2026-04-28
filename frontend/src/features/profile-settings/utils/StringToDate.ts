function formatToInputDate(dateStr?: string | null) {
	if (!dateStr) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
	const parts = dateStr.split(/[/\-.]/).map((s) => s.trim());
	if (parts.length === 3) {
		// YYYY-MM-DD or YYYY/MM/DD
		if (parts[0].length === 4) {
			const y = parts[0];
			const m = parts[1].padStart(2, "0");
			const d = parts[2].padStart(2, "0");
			return `${y}-${m}-${d}`;
		}

		// ambiguous formats like D/M/YYYY or M/D/YYYY
		if (parts[2].length === 4) {
			const a = Number(parts[0]);
			const b = Number(parts[1]);
			const y = Number(parts[2]);
			const orders: Array<[number, number]> = [
				[a, b], // assume day/month
				[b, a], // assume month/day
			];
			for (const [day, month] of orders) {
				const dt = new Date(y, month - 1, day);
				if (
					dt.getFullYear() === y &&
					dt.getMonth() === month - 1 &&
					dt.getDate() === day
				) {
					return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
				}
			}
		}
	}

	// fallback to Date parse
	const parsed = new Date(dateStr);
	if (!isNaN(parsed.getTime())) {
		const y = parsed.getFullYear();
		const m = String(parsed.getMonth() + 1).padStart(2, "0");
		const d = String(parsed.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}

	return "";
}

export default formatToInputDate;
