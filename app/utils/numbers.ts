interface Number {
	toRound(decimal: number): number
	padStart(length: number, paddingCharacter: string): string
	padEnd(length: number, paddingCharacter: string): string
}

Number.prototype.toRound = function (decimal: number): number {
	if (typeof decimal !== 'number') return NaN
	const num_sign = this >= 0 ? 1 : -1
	return Math.round((this as number) * Math.pow(10, decimal) + num_sign * 0.0001) / Math.pow(10, decimal)
}

Number.prototype.padStart = function (length: number, paddingCharacter: string): string {
	if (typeof length !== 'number') length = this.toString().length
	if (typeof paddingCharacter !== 'string') paddingCharacter = ''
	return this.toString().padStart(length, paddingCharacter)
}

Number.prototype.padEnd = function (length: number, paddingCharacter: string): string {
	if (typeof length !== 'number') length = this.toString().length
	if (typeof paddingCharacter !== 'string') paddingCharacter = ''
	return this.toString().padEnd(length, paddingCharacter)
}
