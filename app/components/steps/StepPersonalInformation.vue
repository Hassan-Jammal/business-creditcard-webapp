<template>
    <div id="personal-information" class="w-full space-y-8 mt-24">
        <div class="container">
			<p class="font-AeonikBlack text-5xl uppercase mt-4">Personal Information</p>
			<p class="mt-4"></p>
		</div>

        <div class="relative p-4 xl:p-8 bg-[#18181B] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="full_name" class="text-base">Full Name</label>
                        <input v-model="form.personal_information_full_name" type="text" placeholder="Full Name" id="full_name" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none">
                        <div v-if="touched.personal_information_full_name && errors.personal_information_full_name" class="text-xs text-red-500">{{ errors.personal_information_full_name }}</div>
                    </div>
                    <div class="flex flex-col gap-1 w-full">
                        <label for="phone_number" class="text-base">Phone Number</label>
                        <div class="relative flex flex-row items-start gap-1">
                            <div class="flex flex-col gap-1 min-w-[115px]">
                                <Dropdown 
                                    v-model="form.personal_information_code" 
                                    :items="phoneCodeCountries"
                                    label-key="code" 
                                    value-key="iso2" 
                                    image-key="iso2"
                                    :label-resolver="c => `+${c.code}`" 
                                    :selected-label-resolver="c => `+${c.code}`"
                                    placeholder="Code"
                                    trigger-class="min-h-14 px-3 flex justify-between items-center gap-2 border border-[#2C2D30] rounded-lg cursor-pointer bg-[#232427]" />

                                <div v-if="errors.personal_information_code" class="text-xs text-red-500">{{ errors.personal_information_code }}</div>
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <input v-model="form.personal_information_phone_number" type="text" id="phone_number"
                                    placeholder="Phone Number" inputmode="numeric" pattern="[0-9]*" autocomplete="tel"
                                    class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none"
                                    @keydown="allowOnlyNumbers"
                                    @input="form.personal_information_phone_number = numbersOnly($event.target.value)">
                                <div v-if="touched.personal_information_phone_number && errors.personal_information_phone_number"
                                    class="text-xs text-red-500">{{ errors.personal_information_phone_number }}</div>
                            </div>
                        </div>
                        <!-- <input type="text" placeholder="Mobile Number" id="full-name" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none"> -->
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="email_address" class="text-base">Email Address</label>
                        <input v-model="form.personal_information_email_address" type="text" placeholder="Enter Email Address" id="email_address" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none" />
                        <div v-if="touched.personal_information_email_address && errors.personal_information_email_address" class="text-xs text-red-500">{{ errors.personal_information_email_address }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full h-full">
                        <div class="flex flex-col gap-1 w-full">
                            <label for="job_title" class="text-base">Job Title</label>
                            <input v-model="form.personal_information_job_title" type="text" placeholder="Job Title" id="job_title" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none">
                            <div v-if="touched.personal_information_job_title && errors.personal_information_job_title" class="text-xs text-red-500">{{ errors.personal_information_job_title }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCountry } from '~/composables/useCountry'
import { numbersOnly } from '~/utils/numbersOnly'

/* =======================
   PROPS
======================= */
const { form, errors, touched } = defineProps({
    form: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        required: true,
    },
    touched: {
        type: Object,
        required: true,
    },
})

/* =======================
   COUNTRY LOGIC
======================= */
const { selectedCountry, countriesData } = useCountry()

const phoneCodeCountries = computed(() => {
    if (!selectedCountry.value?.iso2) return countriesData

    return countriesData.filter(c =>
        c.code !== selectedCountry.value.code ||
        c.iso2 === selectedCountry.value.iso2
    )
})
</script>