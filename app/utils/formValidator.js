import { isValidEmail, isNumeric, isValidLength, isValidUrl, isSafe, fileType, fileSize } from './validationUtils';

/**
 * Validates the entire form based on the provided validation rules.
 * @param {Object} form - The form data to validate.
 * @param {Object} errors - The object to store validation errors.
 * @param {Object} validationRules - The rules for validation.
 * @returns {boolean} - Whether the form is valid or not.
 */
export const validateForm = (form, errors, validationRules) => {
	let isValid = true

	Object.keys(validationRules).forEach((field) => {
		if (field === 'file') return

		if (Array.isArray(form[field])) {
			errors[field] = form[field].map((item, index) => {
				const fieldErrors = validateNestedFields(
					item,
					index,
					validationRules[field].items
				)
				isValid = isValid && !Object.values(fieldErrors).some(e => e !== '')
				return fieldErrors
			})
		} else {
			const error = validateField(form, field, validationRules)
			errors[field] = error
			isValid = isValid && error === ''
		}
	})

	return isValid
}


/**
 * Validates nested fields within an array.
 * @param {Object} item - The item to validate.
 * @param {number} index - The index of the item in the array.
 * @param {Object} nestedRules - The rules for nested fields.
 * @returns {Object} - The errors for nested fields.
 */
const validateNestedFields = (item, index, nestedRules) => {
    const nestedErrors = {};
    Object.keys(nestedRules).forEach((nestedField) => {
        const rule = nestedRules[nestedField];
        const error = executeRule(item, nestedField, rule);
        nestedErrors[nestedField] = error ? error : '';
        // console.log(nestedErrors[nestedErrors])
    });
    return nestedErrors;
};

/**
 * Validates a single field based on its rules.
 * @param {Object} form - The form data.
 * @param {string} field - The field to validate.
 * @param {Object} validationRules - The rules for validation.
 * @returns {string} - The validation error message or an empty string.
 */
export const validateField = (form, field, validationRules) => {
    const fieldRules = validationRules[field];
    let error = '';
    for (const rule in fieldRules) {
        error = executeRule(form, field, rule, fieldRules)
        if (error) {
            return error;
        }
    }
    return error;
};

/**
 * Executes a validation rule on a field.
 * @param {Object} form - The form data.
 * @param {string} field - The field to validate.
 * @param {string|Object} rule - The rule to apply.
 * @param {Object} fieldRules - The rules for the field.
 * @returns {string} - The validation error message or an empty string.
 */
export const executeRule = (form, field, rule, fieldRules) => {
    // Split field into parts if it's nested
    const fieldParts = field.split('.');
    let value = form;

    // Traverse the form object to get the value
    fieldParts.forEach(part => {
        if (value && typeof value === 'object') {
            value = value[part];
        }
    });

    // console.log(`Validating field: ${field}, Value: ${value}, Rule: ${JSON.stringify(rule)}`);

    // Check if rule is an object or a string
    if (typeof rule === 'object') {
        // Iterate over object rules
        for (const [ruleKey, ruleValue] of Object.entries(rule)) {
            const error = executeRule(form, field, ruleKey, { [ruleKey]: ruleValue });
            if (error) {
                return error;
            }
        }
        return ''; // No error found
    }

    // Process rule as a string
    switch (rule) {
        case 'required':
            if (typeof value === 'boolean') { return value === true ? '' : fieldRules[rule] }
            return value !== null && value !== undefined && value !== '' ? '' : fieldRules[rule]
        case 'email':
            return isValidEmail(value) ? '' : fieldRules[rule];
        case 'numeric':
            if (value === null || value === undefined || value === '') { return ''; }
            return isNumeric(value) ? '' : fieldRules[rule];
        case 'length':
            return isValidLength(value) ? '' : fieldRules[rule];
        case 'code':
            return isSafe(value) ? '' : fieldRules[rule];
        case 'url':
            return isValidUrl(value) ? '' : fieldRules[rule];
        case 'safe':
            return isSafe(value) ? '' : fieldRules[rule];
        case 'fileType':
            return value && fileType(value, fieldRules[rule]) ? '' : fieldRules[rule];
        case 'maxSize':
            return value && fileSize(value, fieldRules[rule]) ? '' : fieldRules[rule];
        case 'range':
            if (!value ||typeof value !== 'object' || value.from == null ||value.to == null) { return fieldRules[rule]; }
            return isValidRange(value.from, value.to) ? '' : fieldRules[rule];
        case 'adult':
            return isAdult(value) ? '' : fieldRules[rule];
        default:
            return '';
    }
};