<template>
	<div :class="[
		'py-3 text-left',
		bg === true
			? 'px-4 bg-[#18181B] rounded-3xl'
			: 'bg-transparent border-b last:border-0'
	]">
		<!-- HEADER -->
		<div class="cursor-pointer flex items-center gap-4 justify-between font-bold text-xl" @click="toggle">
			<span class="text-gray-500 text-base whitespacenowrap font-bold">{{ title }}</span>

			<Icon :name="isOpen ? 'fa7-solid:chevron-up' : 'fa7-solid:chevron-down'" class="icon text-gray-500 text-sm shrink-0 transition-transform duration-300 ease-in-out" />
		</div>

		<!-- CONTENT -->
		<transition @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
			<div v-if="isOpen" class="overflow-hidden text-gray-500 text-base">
				<div class="h-2 w-full"></div>
				<slot />
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'

/* =======================
PROPS
======================= */
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	bg: {
		type: Boolean,
		required: true,
	},
	open: {
		type: Boolean,
		default: false,
	},
})

/* =======================
EMITS
======================= */
const emit = defineEmits(['update:open'])

/* =======================
STATE
======================= */
const isOpen = ref(props.open)

/* =======================
SYNC WITH PARENT
======================= */
watch(
	() => props.open,
	(val) => {
		isOpen.value = val
	}
)

/* =======================
ACTIONS
======================= */
const toggle = () => {
	isOpen.value = !isOpen.value
	emit('update:open', isOpen.value)
}

/* =======================
ANIMATION HOOKS
======================= */
const beforeEnter = (el) => {
	el.style.height = '0'
}

const enter = (el, done) => {
	el.style.transition = 'height 0.3s ease'
	el.style.height = `${el.scrollHeight}px`
	el.addEventListener('transitionend', done, { once: true })
}

const beforeLeave = (el) => {
	el.style.height = `${el.scrollHeight}px`
}

const leave = (el, done) => {
	el.style.transition = 'height 0.3s ease'
	requestAnimationFrame(() => {
		el.style.height = '0'
	})
	el.addEventListener('transitionend', done, { once: true })
}
</script>

<style lang="sass" scoped>
  .content
    overflow: hidden
</style>
