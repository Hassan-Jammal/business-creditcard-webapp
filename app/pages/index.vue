<template>
	<section class="mt-12">
		<div class="container">
			<div class="grid grid-cols-3">
				<div class="col-span-3 md:col-span-2 flex max-xl:flex-col items-start gap-12">
					<ClientOnly>
						<div class="flex-1">
							<!-- STEP 1 -->
							<StepsStepGetStarted 
								:form="form" 
								:errors="errors"
								:touched="touched" 
							/>

							<!-- STEP 2 -->
							<StepsStepPersonalInformation 
								:form="form" 
								:errors="errors"
								:touched="touched" 
							/>

							<!-- STEP 3 -->
							<StepsStepCompanyInformation 
								:form="form" 
								:errors="errors"
								:touched="touched" 
							/>
						</div>
					</ClientOnly>
				</div>
				<div class="hidden md:block md:col-span-1 relative">
					<div class="fixed top-0 right-0 h-screen w-1/3 bg-[url('/images/cards-bg.webp')] bg-contain bg-right bg-no-repeat"></div>
				</div>
			</div>
		</div>
	</section>

	<StepFooterActions
		:is-submitting="submitStatus === 'loading'"
		@next="handleSubmit()"
	/>

	<!-- ================= SUBMIT MODAL ================= -->
	<Teleport to="body">
		<div v-if="showSubmitModal" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
			<div class="relative w-full max-w-md rounded-3xl bg-white p-8 text-center">

				<button v-if="submitStatus !== 'loading'" class="absolute right-4 top-4 text-gray-400 hover:text-black" @click="goHomeAndReset">✕</button>

				<div v-if="submitStatus === 'loading'">
					<div class="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
					<h2 class="text-2xl font-AeonikBlack">Please wait</h2>
					<p class="mt-2 text-gray-500">Your application is being submitted. <br /> Please do not refresh the page.</p>
				</div>

				<div v-if="submitStatus === 'success'">
					<h2 class="text-3xl font-AeonikBlack text-green-600">Application Submitted 🎉</h2>
					<p class="mt-4 text-gray-600">Thank you for your application. Our team will review it shortly.</p>
					<button class="mt-8 w-full rounded-full bg-black py-3 text-white" @click="goHomeAndReset">Go to homepage</button>
				</div>

				<div v-if="submitStatus === 'error'">
					<h2 class="text-2xl font-AeonikBlack text-red-600">Something went wrong</h2>
					<p class="mt-4 text-gray-600">Please try again later.</p>
					<button class="mt-8 w-full rounded-full bg-black py-3 text-white" @click="goHomeAndReset">Close</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
/* ==========================================================================
   IMPORTS
============================================================================ */
import confetti from 'canvas-confetti'
import { useCountry } from '~/composables/useCountry'

const { selectedCountry, detectCountry, resetCountry, countriesData } = useCountry()

useSeoMeta({
	title: '',
	description: '',
	ogTitle: '',
	ogDescription: '',
	ogImage: 'https://creditcard.mymonty.com.lb/images/og-image-1200x630.webp',
	twitterTitle: '',
	twitterDescription: '',
	twitterCard: 'summary_large_image',
})

/* ==========================================================================
   Helpers
============================================================================ */
const resolveNumericCode = (iso2) => {
	return countriesData.find(c => c.iso2 === iso2)?.code || iso2
}

const isValidIso2 = (value) => {
	return !!countriesData.find(c => c.iso2 === value)
}

/* ==========================================================================
   Persistence (Cookies)
============================================================================ */
const formCookie = useCookie('credit-card-form', {
	sameSite: 'lax',
	maxAge: 60 * 60 * 24 * 7,
})

const progressSession = useCookie('application_drafts_id', {
	maxAge: 60 * 60 * 24 * 7,
	sameSite: 'lax',
})

const getCookieSafeForm = (form) => {
	const { campaign_id, campaign_name, campaign_medium, campaign_source, ...rest } = form
	return rest
}

/* ==========================================================================
   Global Form State
============================================================================ */
const getInitialForm = () => ({
	campaign_id: '',
	campaign_name: '',
	campaign_medium: '',
	campaign_source: '',

	get_started_is_onboarded: '',
	get_started_referral_source: '',
	get_started_referral_name: '',
	get_started_is_acknowledged: 'Yes',

	personal_information_full_name: '',
	personal_information_code: '',
	personal_information_phone_number: '',
	personal_information_email_address: '',
	personal_information_job_title: '',

	company_information_company_name: '',
	company_information_country_id: '',
	company_information_industry: '',
	company_information_company_website: '',
	company_information_company_address: '',
})

const form = ref(getInitialForm())

/* ==========================================================================
   Validation State
============================================================================ */
const touched = ref({})

const getInitialErrors = () => ({
	get_started_is_onboarded: '',
	get_started_referral_source: '',
	get_started_referral_name: '',
	get_started_is_acknowledged: '',

	personal_information_full_name: '',
	personal_information_code: '',
	personal_information_phone_number: '',
	personal_information_email_address: '',
	personal_information_job_title: '',

	company_information_company_name: '',
	company_information_country_id: '',
	company_information_industry: '',
	company_information_company_website: '',
	company_information_company_address: '',
})

const errors = ref(getInitialErrors())

/* ==========================================================================
   Validation Logic
============================================================================ */
const needsReferralName = computed(() => {
	return ['Family', 'Friend', 'Colleague'].includes(
		form.value.get_started_referral_source
	)
})

/* ==========================================================================
   Watches — Persistence & Sync
============================================================================ */
watch(
	form,
	(val) => {
		formCookie.value = getCookieSafeForm(val)
	},
	{ deep: true }
)

watch(
	() => form.value.get_started_referral_source,
	(val) => {
		if (!['Family', 'Friend', 'Colleague'].includes(val)) {
			form.value.get_started_referral_name = ''
			errors.value.get_started_referral_name = ''
			touched.value.get_started_referral_name = false
		}
	}
)

// Auto-save draft as user fills in contact fields
watch(
	() => [
		form.value.personal_information_full_name,
		form.value.personal_information_email_address,
		form.value.personal_information_phone_number,
		form.value.personal_information_code,
	],
	() => {
		if (
			form.value.personal_information_full_name ||
			form.value.personal_information_email_address ||
			form.value.personal_information_phone_number
		) {
			ensureProgressSession()
			sendProgress()
		}
	}
)

/* ==========================================================================
   Validation Rules
============================================================================ */
const validationRules = computed(() => ({
	get_started_is_onboarded: {
		required: 'Please select Yes or No',
		safe: 'Invalid value selected',
	},
	get_started_referral_source: {
		required: 'Please select your referral source',
		safe: 'Invalid value selected',
	},
	...(needsReferralName.value && {
		get_started_referral_name: {
			required: 'Please enter your referral name',
			safe: 'Invalid referral name',
		},
	}),
	get_started_is_acknowledged: {
		required: 'You must acknowledge this before continuing',
		safe: 'Invalid value selected',
	},
	personal_information_full_name: {
		required: 'Please enter your full name',
		safe: 'Invalid full name',
	},
	personal_information_code: {
		required: 'Please select your country code',
		code: 'Please select a valid country code',
		safe: 'Invalid country code',
	},
	personal_information_phone_number: {
		required: 'Please enter your phone number',
		numeric: 'Phone number must contain numbers only',
		length: 'Please enter a valid phone number',
		safe: 'Invalid phone number',
	},
	personal_information_email_address: {
		required: 'Please enter your email address',
		email: 'Please enter a valid email address',
		safe: 'Invalid email address',
	},
	personal_information_job_title: {
		required: 'Please enter your job title',
		safe: 'Invalid job title',
	},
	company_information_company_name: {
		required: 'Please enter your company name',
		safe: 'Invalid company name',
	},
	company_information_country_id: {
		required: 'Please select your country',
		safe: 'Invalid country selection',
	},
	company_information_industry: {
		required: 'Please enter your industry',
		safe: 'Invalid industry',
	},
	company_information_company_website: {
		url: 'Please make sure the link is correct',
		safe: 'Invalid company website',
	},
	company_information_company_address: {
		required: 'Please enter your company address',
		safe: 'Invalid company address',
	},
}))

/* ==========================================================================
   Submission Helpers
============================================================================ */
const buildPayload = () => {
	const payload = { ...form.value }
	payload.personal_information_code = resolveNumericCode(payload.personal_information_code)
	return payload
}

/* ==========================================================================
   Confetti
============================================================================ */
const fireConfetti = () => {
	const duration = 1200
	const end = Date.now() + duration

	const frame = () => {
		confetti({ particleCount: 14, angle: 70, spread: 700, startVelocity: 45, origin: { x: 0 } })
		confetti({ particleCount: 14, angle: 110, spread: 700, startVelocity: 45, origin: { x: 1 } })
		if (Date.now() < end) requestAnimationFrame(frame)
	}

	frame()
}

/* ==========================================================================
   Submit Handler
============================================================================ */
const showSubmitModal = ref(false)
const submitStatus = ref('idle') // idle | loading | success | error
const router = useRouter()

watch(showSubmitModal, (v) => {
	document.body.style.overflow = v ? 'hidden' : ''
})

const goHomeAndReset = async () => {
	showSubmitModal.value = false
	submitStatus.value = 'idle'
	formCookie.value = null
	progressSession.value = null
	Object.assign(form.value, getInitialForm())
	errors.value = getInitialErrors()
	touched.value = {}

	// Reset singleton and re-detect so country fields aren't blank
	resetCountry()
	await detectCountry()

	if (selectedCountry.value?.iso2) {
		form.value.personal_information_code = selectedCountry.value.iso2
	}
	if (selectedCountry.value?.id) {
		form.value.company_information_country_id = selectedCountry.value.id
	}

	await nextTick()
	router.push('/')
}

const markAllTouched = () => {
	Object.keys(errors.value).forEach((key) => {
		touched.value[key] = true
	})
}

const handleSubmit = async () => {
	if (submitStatus.value === 'loading') return

	markAllTouched()

	const isFormValid = validateForm(form.value, errors.value, validationRules.value)
	if (!isFormValid) return

	showSubmitModal.value = true
	submitStatus.value = 'loading'

	try {
		const payload = buildPayload()
		const formData = new FormData()

		Object.entries(payload).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				formData.append(key, value)
			}
		})

		const response = await fetch('https://leb-backend.mymonty.com/api/business-applications', {
			method: 'POST',
			body: formData,
			headers: { Accept: 'application/json' },
		})

		if (!response.ok) throw new Error('Network response was not ok')

		const data = await response.json()

		if (data.status === 'validation_failed') {
			submitStatus.value = 'error'
			return
		}

		submitStatus.value = 'success'
		fireConfetti()

		if (progressSession.value) {
			await fetch('https://leb-backend.mymonty.com/api/business-application-drafts/complete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					session_id: progressSession.value,
					application_id: data.application_id,
				}),
			})
			progressSession.value = null
		}
	} catch (error) {
		submitStatus.value = 'error'
		console.error('Form submission error:', error)
	}
}

/* ==========================================================================
   Restore State on Mount
============================================================================ */
const route = useRoute()

const setCampaignFieldsFromQuery = () => {
	form.value.campaign_source = route.query.utm_source || ''
	form.value.campaign_medium = route.query.utm_medium || ''
	form.value.campaign_name = route.query.utm_campaign || ''
	form.value.campaign_id = route.query.utm_id || ''
}

onMounted(async () => {
	// 1. Restore cookie first — user's saved values take priority
	const cookie = formCookie.value || {}
	Object.keys(form.value).forEach((key) => {
		const val = cookie[key]
		if (val !== '' && val !== null && val !== undefined) {
			form.value[key] = val
		}
	})

	// 2. Only detect country if the cookie had no valid code saved
	const cookieCode = form.value.personal_information_code
	const cookieCountryId = form.value.company_information_country_id

	const needsCode = !cookieCode || !isValidIso2(cookieCode)
	const needsCountryId = !cookieCountryId

	if (needsCode || needsCountryId) {
		await detectCountry()

		if (needsCode && selectedCountry.value?.iso2) {
			form.value.personal_information_code = selectedCountry.value.iso2
		}
		if (needsCountryId && selectedCountry.value?.id) {
			form.value.company_information_country_id = selectedCountry.value.id
		}
	}

	// 3. Always set campaign fields from URL
	setCampaignFieldsFromQuery()
})

/* ==========================================================================
   Progress Tracking
============================================================================ */
const ensureProgressSession = () => {
	if (!progressSession.value) {
		progressSession.value = crypto.randomUUID()
	}
}

let progressTimeout = null

const sendProgress = () => {
	clearTimeout(progressTimeout)

	progressTimeout = setTimeout(() => {
		const numericCode = resolveNumericCode(form.value.personal_information_code)

		fetch('https://leb-backend.mymonty.com/api/business-application-drafts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				session_id: progressSession.value,
				full_name: form.value.personal_information_full_name || null,
				email: form.value.personal_information_email_address || null,
				phone: form.value.personal_information_phone_number
					? `+${numericCode}${form.value.personal_information_phone_number}`
					: null,
			}),
		})
	}, 600)
} 
</script>

<style lang="sass">
	.input-file input
		@apply opacity-0 absolute w-full h-full

	.input-file label
		@apply bg-white cursor-pointer border border-dashed border-[#e0e0e0] rounded-xl xl:min-h-[200px] flex items-center justify-center p-4 xl:p-8 text-center
</style>