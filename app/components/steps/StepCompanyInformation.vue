<template>
    <div id="company-information" class="w-full space-y-8 mt-24">
        <div class="container">
			<p class="font-AeonikBlack text-5xl uppercase mt-4">Company Information</p>
			<p class="mt-4"></p>
		</div>

        <div class="relative p-4 xl:p-8 bg-[#18181B] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="company_name" class="text-base">Company Name</label>
                        <input v-model="form.company_information_company_name" type="text" placeholder="Company Name" id="company_name" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none">
                        <div v-if="touched.company_information_company_name && errors.company_information_company_name" class="text-xs text-red-500">{{ errors.company_information_company_name }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="country" class="text-base">Country of registration</label>
                        <Dropdown
                            v-model="form.company_information_country_id"
                            :items="countriesData"
                            label-key="name"
                            value-key="id"
                            image-key="iso2"
                            :label-resolver="c => `${c.name}`"
                            :selected-label-resolver="c => `${c.name}`"
                            placeholder="Select Country"
                            trigger-class="min-h-14 px-3 flex justify-between items-center gap-2 border border-[#2C2D30] rounded-lg cursor-pointer bg-[#232427]"
                        />
                        <div v-if="touched.company_information_country_id && errors.company_information_country_id" class="text-xs text-red-500">{{ errors.company_information_country_id }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="gender" class="text-base">Industry</label>
                        <Dropdown v-model="form.company_information_industry" :items="[
                            { label: 'Single', value: 'Single' },
                            { label: 'Married', value: 'Married' },
                            { label: 'Divorced', value: 'Divorced' },
                            { label: 'Widowed', value: 'Widowed' }
                        ]" label-key="label" value-key="value" :label-resolver="c => `${c.label}`"
                            :selected-label-resolver="c => `${c.label}`" :searchable="false"
                            trigger-class="min-h-14 px-3 flex justify-between items-center gap-2 border border-[#2C2D30] rounded-lg cursor-pointer bg-[#232427]" />

                        <div v-if="touched.company_information_industry && errors.company_information_industry"
                            class="text-xs text-red-500">{{ errors.company_information_industry }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="company_website" class="text-base">Company Website</label>
                        <input v-model="form.company_information_company_website" type="text" placeholder="Company Website" id="company_website" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none" />
                        <div v-if="touched.company_information_company_website && errors.company_information_company_website" class="text-xs text-red-500">{{ errors.company_information_company_website }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="company_address" class="text-base">Company Address</label>
                        <input v-model="form.company_information_company_address" type="text" placeholder="Company Address" id="company_address" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none" />
                        <div v-if="touched.company_information_company_address && errors.company_information_company_address" class="text-xs text-red-500">{{ errors.company_information_company_address }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCountry } from '~/composables/useCountry'

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
const { countriesData } = useCountry()


</script>