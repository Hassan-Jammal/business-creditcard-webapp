<template lang="">
	<!-- <section class="bg-[url('images/error-image.webp')] bg-cover bg-center w-screen h-screen flex flex-col items-center justify-center">
		<div class="container">		
			<div class="w-full lg:w-1/2 flex gap-4 mx-auto text-center flex flex-col items-center justify-center">
				<h1 class="text-4xl text-white font-bold mt-4">{{ error.statusCode }}</h1>
				<h2 class="text-2xl lg:text-4xl text-white font-semibold mt-2">Hey! Nothing to show here</h2>
				<p class="text-base lg:text-lg text-white mt-2">We're sorry, but the page you're looking for doesn't exist. It might have been removed, or is temporarily unavailable.<br />Please try again later.</p>
				<a href="/" class="mt-14">
					<button class="py-2 px-6 min-w-[120px] text-white bg-primary hover:text-black hover:bg-white rounded-full select-none transition-all duration-300 ease-in-out">Back to Homepage</button>
				</a>
			</div>
		</div>
	</section> -->
</template>

<script setup lang="ts">
// 	const props = defineProps({
// 		error: Object as () => NuxtError
// 	})
// 	// https://nuxt.com/docs/4.x/getting-started/upgrade#new-directory-structure
// 	// const data = error.data

// 	useServerSeoMeta({
// 	title: () => `Error ${props.error.statusCode || 'Unknown'}`,
// 	description: () => `Error ${props.error.message || 'Message'}`,

// 	ogTitle: () => `Error ${props.error.statusCode || 'Unknown'}`,
// 	ogDescription: () => `Error ${props.error.message || 'Message'}`,

// 	twitterTitle: () => `Error ${props.error.statusCode || 'Unknown'}`,
// 	twitterDescription: () => `Error ${props.error.message || 'Message'}`,
// })

// 	// const handleError = () => clearError({ redirect: '/' })

// 	useHead({
// 		bodyAttrs: {
// 			class: "w-screen h-screen bg-black"
// 		}
// 	})
</script>

<style lang="sass" scoped>
	// .animated-path
	// 	fill: white
	// 	stroke: none
	// 	stroke-width: 2
	// 	animation: fillStrokeToggle 2s infinite

	// @keyframes fillStrokeToggle
	// 	0%, 50%
	// 		fill: white
	// 		stroke: none

	// 	0%, 100%
	// 		fill: none
	// 		stroke: white
</style>