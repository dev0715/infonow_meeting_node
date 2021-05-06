interface String {
	capitalize(): string
	parseJson(): any
}

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

String.prototype.parseJson = function () {
	return JSON.parse(this.toString())
}
