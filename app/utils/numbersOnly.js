// utils/numbersOnly.js
export const numbersOnly = (value = '') => {
	return value.replace(/\D+/g, '')
}