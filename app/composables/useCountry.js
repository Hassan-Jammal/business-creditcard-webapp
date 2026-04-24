import countriesData from '~/data/countries.json'

// Shared state — created once, reused across all useCountry() calls
const selectedCountry = ref({})
const countryIsEU = ref(false)
const initialCode = ref('')
const errors = ref({ country: null })

export const useCountry = () => {
    const detectCountry = async () => {
        try {
            const response = await fetch('/api/geoip')
            const data = await response.json()

            if (data && data.country) {
                const detectedCountry = countriesData.find(c => c.iso2 === data.country)

                if (detectedCountry) {
                    if (!selectedCountry.value?.iso2) {
                        countryIsEU.value = detectedCountry.is_eu
                        selectedCountry.value = detectedCountry
                        initialCode.value = detectedCountry.code
                    }
                }
            } else {
                errors.value.country = 'No country data found'
            }
        } catch (error) {
            errors.value.country = 'Unable to detect country'
        }
    }

    const resetCountry = () => {
        selectedCountry.value = {}
        countryIsEU.value = false
        initialCode.value = ''
    }

    return {
        countriesData,
        selectedCountry,
        countryIsEU,
        initialCode,
        errors,
        detectCountry,
        resetCountry,
    }
}