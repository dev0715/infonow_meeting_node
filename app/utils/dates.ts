interface Date {
	toMySqlDateString(): string
	to24HourTimeString(): string
	to12HourTimeString(): string
	toMySqlDateTimeString(): string
	toMySqlDateTimeStringZ(): string
	toMySqlTimestamp(): number
}

Date.prototype.toMySqlDateString = function () {
	return `${this.getFullYear()}-${(Number(this.getMonth()) + 1).toString().padStart(2, '0')}-${Number(this.getDate())
		.toString()
		.padStart(2, '0')}`
}

Date.prototype.to24HourTimeString = function () {
	return `${this.getHours().padStart(2, '0')}:${this.getMinutes().padStart(2, '0')}:${this.getSeconds().padStart(2, '0')}`
}

Date.prototype.to12HourTimeString = function () {
	const hour = Number(this.getHours())
	const TM = hour >= 0 && hour < 12 ? 'AM' : 'PM'
	let hours12 = hour
	if (hour === 0) hours12 = 12
	if (hour > 12) hours12 = hour - 12

	return `${hours12.padStart(2, '0')}:${this.getMinutes().padStart(2, '0')}:${this.getSeconds().padStart(2, '0')} ${TM}`
}

Date.prototype.toMySqlDateTimeString = function () {
	const dateString = this.toMySqlDateString()
	const timeString = `${this.getHours().padStart(2, '0')}:${this.getMinutes().padStart(2, '0')}:${this.getDate().padStart(
		2,
		'0'
	)}`
	return `${dateString} ${timeString}`
}

Date.prototype.toMySqlDateTimeStringZ = function () {
	const utcDate = new Date(this.toUTCString())
	return String(utcDate.toISOString())
}

Date.prototype.toMySqlTimestamp = function () {
	return (this.getTime() / 1000).toRound(0)
}
