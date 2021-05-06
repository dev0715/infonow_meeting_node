'use strict'
import _ from 'lodash'
import PhoneNumber from 'awesome-phonenumber'
import { countriesWithMobileCodes as countries } from './countries'
import Filter from 'bad-words'
import moment from 'moment'
import UUID_LIB from 'uuid'

const filterProfanity = new Filter()
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const latRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/
const lngRegex = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
const numberRegex = /^[-+]?[0-9]*$/
const floatRegex = /^[-+]?\d+(\.\d+)?$/
const hashIdRegex = /^[a-zA-Z0-9]*$/
const stripeTokenRegex = /^[a-zA-Z0-9_]*$/
const nameRegex = /^[a-zA-Z\s]*$/
const timestampRegex = /^[0-9]{10,14}$/
const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
const UUID_REGEX_ROUTE = '[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}'

/**
 * @description Validates the given phone number, produces error if not a valid number.
 * @param {*} phoneNumberString
 * @returns {*} {phoneNumber,countryCode} | Error
 */
function isPhoneNumber_(phoneNumberString: string) {
	try {
		phoneNumberString = phoneNumberString || ''
		if (phoneNumberString.indexOf('+') < 0) phoneNumberString = '+' + phoneNumberString

		const vPhone = new PhoneNumber(phoneNumberString)
		if (vPhone.isValid() && vPhone.getRegionCode()) {
			const type = vPhone.getType()
			const allowedTypes = ['fixed-line', 'fixed-line-or-mobile', 'mobile', 'personal-number']
			if (allowedTypes.indexOf(type) > -1) {
				if (PhoneNumber.getCountryCodeForRegionCode(vPhone.getRegionCode())) {
					return {
						phoneNumber: vPhone.getNumber('significant'),
						countryCode: PhoneNumber.getCountryCodeForRegionCode(vPhone.getRegionCode())
					}
				}
				return new Error('Phone number is not supported.')
			} else {
				return new Error('Phone number is not supported.')
			}
		} else {
			if (vPhone.getRegionCode()) {
				const examplePhone = PhoneNumber.getExample(vPhone.getRegionCode(), 'mobile').getNumber()
				if (examplePhone) {
					return new Error(`Phone number is not valid, your phone number may look like ${examplePhone}.`)
				}
			}
			return new Error('Phone number not valid.')
		}
	} catch (exception) {
		console.log(
			'\x1b[31m *** IMPORTANT *** ** EXCEPTION ** : Phone Number cannot be validated.. Details: ',
			exception,
			'\x1b[0m'
		)
		return new Error('Something went wrong')
	}
}

/**
 * @description Validates the given phone number, returns false if not a valid number else the number string.
 * @param {*} phoneNumber
 * @returns {*} PhonenumberString | false
 */
function isPhoneNumberFormatted(phoneNumber: string) {
	try {
		phoneNumber = phoneNumber || ''
		if (phoneNumber.indexOf('+') < 0) phoneNumber = '+' + phoneNumber

		const vPhone = new PhoneNumber(phoneNumber)
		if (vPhone.isValid() && vPhone.getRegionCode()) {
			const type = vPhone.getType()
			const allowedTypes = ['fixed-line', 'fixed-line-or-mobile', 'mobile', 'personal-number']
			if (allowedTypes.indexOf(type) > -1) {
				if (PhoneNumber.getCountryCodeForRegionCode(vPhone.getRegionCode())) {
					const countryCode = PhoneNumber.getCountryCodeForRegionCode(vPhone.getRegionCode())
					const phone = vPhone.getNumber('significant')
					return { countryCode, phone }
				}
			}
		}
		return false
	} catch (exception) {
		console.log(
			'\x1b[31m *** IMPORTANT *** ** EXCEPTION ** : Phone Number cannot be validated.. Details: ',
			exception,
			'\x1b[0m'
		)
		return false
	}
}

/**
 * @description Validates the given phone number, returns false if not a valid number else the number string.
 * @param {*} phoneNumber
 * @returns {*} PhonenumberString | false
 */
function isPhoneNumber(phoneNumber: string) {
	try {
		phoneNumber = phoneNumber || ''
		if (phoneNumber.indexOf('+') < 0) phoneNumber = '+' + phoneNumber

		const vPhone = new PhoneNumber(phoneNumber)
		if (vPhone.isValid() && vPhone.getRegionCode()) {
			const type = vPhone.getType()
			const allowedTypes = ['fixed-line', 'fixed-line-or-mobile', 'mobile', 'personal-number']
			if (allowedTypes.indexOf(type) > -1) {
				if (PhoneNumber.getCountryCodeForRegionCode(vPhone.getRegionCode())) {
					const countryCode = PhoneNumber.getCountryCodeForRegionCode(vPhone.getRegionCode())
					const phone = vPhone.getNumber('significant')
					return `+${countryCode}${phone}`
				}
			}
		}
		return false
	} catch (exception) {
		console.log(
			'\x1b[31m *** IMPORTANT *** ** EXCEPTION ** : Phone Number cannot be validated.. Details: ',
			exception,
			'\x1b[0m'
		)
		return false
	}
}

/**
 * @description Validates an Email Address, returns false if not a valid email else the email string.
 * @param {*} email
 * @returns {*} emailString | false
 */
function isEmailAddress(email: any) {
	email = email ?? ''
	email = String(email).trim() ?? ''
	if (email.length < 5 || email.length > 70) return false
	return emailRegex.test(email) ? email : false
}

/**
 * @description Validates an number, returns false if not a valid float number else the float as string.
 * @param {*} number
 * @returns {*} floatString | NaN
 */
function isFloat(number: any) {
	number = String(number).trim()
	if (number.length > 20 || number.length <= 0) return NaN
	return floatRegex.test(number) ? Number(number) : NaN
}

/**
 * @description Validates an number, returns false if not a valid integer else the integer as string.
 * @param {*} number
 * @returns {*} integerString | NaN
 */
function isNumber(number: any) {
	number = String(number).trim()
	if (number.length > 15 || number.length <= 0) return Number.NaN
	return numberRegex.test(number) ? Number(number) : Number.NaN
}

/**
 * @description Validates an Latitude value, returns false if not a valid Latitude else the Latitude as string.
 * @param {*} lat
 * @returns {*} latitudeAsString | false
 */
function isLatitude(lat: any) {
	lat = String(lat).trim()
	lat = lat.length > 20 ? lat.substr(0, 13) : lat
	if (lat.length > 20 || lat.length < 1) return NaN
	return latRegex.test(lat) ? Number(lat) : NaN
}

/**
 * @description Validates an Longitude value, returns false if not a valid Longitude else the Longitude as string.
 * @param {*} lng
 * @returns {*} longitudeAsString | false
 */
function isLongitude(lng: any) {
	lng = String(lng).trim()
	lng = lng.length > 20 ? lng.substr(0, 13) : lng
	if (lng.length > 20 || lng.length < 1) return NaN
	return lngRegex.test(lng) ? Number(lng) : NaN
}

/**
 * @description Validates an Name value, returns false if not a valid Name else the Name as string.
 * @param {*} name
 * @param {*} allowedLength | default=30
 * @param {*} titleCase | default=false | returns TitleCaseName if true
 * @returns {*} nameString | false
 */
function isName(name: any, allowedLength = 30, titleCase = false) {
	name = name || ''

	if (!name) return false
	name = String(name).trim()
	name.replace(/\s\s+/gi, ' ')

	if (name.length <= 0 || name.length > allowedLength) return false

	if (nameRegex.test(name)) {
		if (titleCase) {
			return name
				.split(' ')
				.map((txt: string) => {
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
				})
				.join(' ')
		} else return name
	} else return false
}

/**
 * @description Validates an Auth Code Integer value, returns false if not a valid Number else the number as string.
 * @param {*} code
 * @param {*} maxLength | default=>4
 * @returns {*} codeAsString | false
 */
function isCode(code: any, maxLength = 4) {
	code = String(code).substring(0, maxLength)
	if (/^[0-9]*$/.test(code)) {
		return code
	} else {
		return false
	}
}

/**
 * @description Validates an text value, returns false if not a exceeds a given value or is less than given value.
 * All the dangeroud characters are removed from string automatically.
 * @param {*} code
 * @param {*} minLength | default=>0
 * @param {*} maxLength | default=>50
 * @returns {*} textAsString | false
 */
function sanitizeRichText(text: any, minLength = 0, maxLength = 50) {
	text = text || ''
	minLength = minLength || 0
	maxLength = maxLength || 50

	let sts = String(text).trim()
	sts = sts.replace(/\s\s+/g, ' ')
	if (sts.length > maxLength || sts.length < minLength) {
		return false
	}
	sts = sts.replace(/[^a-zA-Z0-9\s\*\.\,\@\%\&\^\!\$\#\(\)\-\_\+\=]*$/, '')
	sts = sts.replace(/\s\s+/g, ' ')
	return sts
}

/**
 * @description Filter the text with * if it contains profanity, returns filtered text.
 * @param {String} potentialText   potentialText
 * @returns {String} filteredText
 */
function filterProfaneText(potentialText: any) {
	potentialText = potentialText || ''
	potentialText = String(potentialText)
	return filterProfanity.clean(potentialText)
}

/**
 * @description Validates the TWO character Country code. Returns TWO character country code if valid, false otherwise.
 * @param {String} countryCode
 */
function isCountryCode(countryCode: any) {
	countryCode = String(countryCode)
	const countryCodes = countries.map(x => x.isoCode)
	if (countryCodes.indexOf(countryCode) > -1) {
		return countryCode
	} else {
		return false
	}
}

/**
 * @description Validates the a pair of Latitude and Longitude. Returns Lat,Lng object if valid, false otherwise.
 * @param {lat,lng} latLng
 */
function isLatLng(latLng: any) {
	if (_.has(latLng, 'lat') && _.has(latLng, 'lng')) {
		const lat: any = isLatitude(latLng.lat)
		const lng: any = isLongitude(latLng.lng)
		if (lat !== false && lng !== false) {
			return {
				lat,
				lng
			}
		} else {
			return false
		}
	} else {
		return false
	}
}

function isUnixTimestamp(timestamp: any) {
	timestamp = String(timestamp)

	if (timestamp.length < 8 || timestamp.length > 14) {
		return false
	}

	if (timestampRegex.test(timestamp)) {
		return timestamp.length == 13 ? String(Number(timestamp) / 1000) : timestamp
	} else {
		return false
	}
}

function isUuid(uuidString: string): boolean {
	return UUID_LIB.validate(uuidString)
}

function isStripeToken(stripeToken?: string): boolean {
	if (!stripeToken) return false;
	let token = String(stripeToken)
	return token.length > 10 && token.length < 64;
}

function isStrongPassword(
	passwordString: any,
	minLength = 8,
	maxLength = 16,
	includeUppercase = false,
	includeLowercase = false,
	includeNumber = false
) {
	const password = String(_.isNull(passwordString) || _.isUndefined(passwordString) ? '' : passwordString)
	if (password.length < minLength) return false
	if (password.length > maxLength) return false
	if (includeUppercase) if (!/[A-Z]+/.test(password)) return false
	if (includeLowercase) if (!/[a-z]+/.test(password)) return false
	if (includeNumber) if (!/[0-9]+/.test(password)) return false

	return true
}

function isDateTime(value: any, returnMySqlDate = false) {
	const dateTime = Date.parse(value)
	if (isNaN(dateTime)) return false

	const date = moment(dateTime).format('YYYY-MM-DD HH:mm')
	return returnMySqlDate ? date : value
}

export {
	isPhoneNumber_,
	isPhoneNumber,
	isPhoneNumberFormatted,
	isEmailAddress,
	isFloat,
	isNumber,
	isLatitude,
	isLongitude,
	isName,
	isCode,
	sanitizeRichText,
	filterProfaneText,
	isCountryCode,
	isLatLng,
	isUnixTimestamp,
	isUuid,
	isStrongPassword,
	isDateTime,
	isStripeToken,
	UUID_REGEX,
	UUID_REGEX_ROUTE
}
