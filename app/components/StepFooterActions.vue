<template>
    <section class="fixed bottom-0 left-0 w-full bg-[#18181B] mt-48 py-4 shadow-[0px_-3px_14px_0px_rgba(29,37,44,0.1)] z-50">
        <div class="container flex justify-end gap-4">
            <button @click="$emit('next')" :disabled="isSubmitting" class="flex items-center gap-2 font-AeonikMedium py-2 px-14 text-white bg-primary rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed">
                <span>Apply</span>
                <Icon name="material-symbols:arrow-right-alt-rounded" class="text-3xl mt-[2px]" />
            </button>
        </div>
    </section>
</template>

<script setup>
defineProps({
    isSubmitting: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['next'])
</script>
