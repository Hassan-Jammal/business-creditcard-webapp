<template>
	<div id="get-started" class="w-full space-y-8">
		<div class="container">
			<p class="font-AeonikBlack text-5xl uppercase mt-4">Get Started</p>
			<p class="mt-4"></p>
		</div>
		
		<!-- Onboarded -->
		<div class="p-4 xl:p-8 rounded-3xl bg-[#18181B]">
			<h3 class="font-AeonikMedium border-b border-[#3E3E40] pb-4">
				Are you an onboarded MyMonty Business Client?
			</h3>

			<div class="flex flex-col gap-1 w-full">
				<div class="flex items-center gap-6 text-gray-500">
					<label class="custom-radio flex gap-4 mt-4">
						<input type="radio" name="is_onboarded" value="Yes" v-model="form.get_started_is_onboarded" />
						<span></span>
						<p>Yes</p>
					</label>

					<label class="custom-radio flex gap-4 mt-4">
						<input type="radio" name="is_onboarded" value="No" v-model="form.get_started_is_onboarded" />
						<span></span>
						<p>No</p>
					</label>
				</div>
				<div v-if="touched.get_started_is_onboarded && errors.get_started_is_onboarded" class="text-xs text-red-500">{{ errors.get_started_is_onboarded }}</div>
			</div>
		</div>

		<div class="flex max-lg:flex-col gap-4 justify-between items-start p-4 xl:p-8 rounded-3xl bg-[#18181B]">
			<div class="flex flex-col gap-1 w-full xl:w-1/2">
				<label for="referral_source" class="font-AeonikMedium">How did u hear about the program?</label>
				<Dropdown 
					v-model="form.get_started_referral_source" 
					:items="[
						{ label: 'Social media', value: 'Social media' },
						{ label: 'Website', value: 'Website' },
						{ label: 'Family', value: 'Family' },
						{ label: 'Friend', value: 'Friend' },
						{ label: 'Colleague', value: 'Colleague' },
						{ label: 'Other', value: 'Other' },
					]" 
					label-key="label"
					value-key="value" 
					:label-resolver="c => `${c.label}`"
					:selected-label-resolver="c => `${c.label}`" 
					:searchable="false"
					trigger-class="min-h-14 px-3 flex justify-between items-center gap-2 border border-[#2C2D30] rounded-lg cursor-pointer bg-[#232427] w-full"
				/>
				<div v-if="touched.get_started_referral_source && errors.get_started_referral_source" class="text-xs text-red-500">{{ errors.get_started_referral_source }}</div>
			</div>

			<div v-if="['Family', 'Friend', 'Colleague'].includes(form.get_started_referral_source)" class="flex flex-col gap-1 w-full xl:w-1/2">
				<label for="referral_name" class="font-AeonikMedium">We would love to know who sent you our way</label>
				<input v-model="form.get_started_referral_name" type="text" placeholder="Enter referral name" id="referral_name" class="w-full h-full min-h-14 py-3 px-3 bg-[#232427] border border-[#2C2D30] rounded-lg outline-none" />
				<div v-if="touched.get_started_referral_name && errors.get_started_referral_name" class="text-xs text-red-500">{{ errors.get_started_referral_name }}</div>
			</div>
		</div>

		<!-- Acknowledgement -->
		<!-- <div class="flex flex-col gap-1 w-full">
			<label class="custom-radio flex gap-4 mt-4 text-gray-500">
				<input type="radio" name="is_acknowledged" value="Yes" v-model="form.get_started_is_acknowledged" />
				<span></span>
				<p>
					By checking this box, I agree to the attached
					<a href="" target="_blank" class="text-primary">Terms & Conditions</a> &
					<a href="" target="_blank" class="text-primary">Key Fact Statement</a>
				</p>
			</label>
			<div v-if="touched.get_started_is_acknowledged && errors.get_started_is_acknowledged"
				class="text-xs text-red-500">{{ errors.get_started_is_acknowledged }}</div>
		</div>
		<h3 class="font-AeonikMedium text-[#232427] bg-primary w-max rounded-3xl py-2 px-4 mt-4">
			Get to know your Business credit cards rates and fees
		</h3> -->

	</div>
</template>

<script setup>
/* =======================
PROPS
======================= */
defineProps({
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
</script>
