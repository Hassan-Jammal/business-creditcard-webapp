<template>
    <button @click="$emit('click')">
        <slot />
    </button>
</template>

<script setup>
defineEmits(['click'])
</script>