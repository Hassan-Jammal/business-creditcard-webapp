<template>
	<div class="w-full space-y-8">
		<div class="relative p-4 xl:p-8 bg-[#18181B] rounded-3xl">
			<label :for="inputId" class="text-base font-AeonikMedium">
				<span v-html="label"></span>
				<span v-if="!required" class="text-gray-400 ml-1">(Optional)</span>
			</label>

			<p class="text-gray-500 pb-4" v-html="description"></p>

			<div class="flex flex-col gap-4 lg:gap-8">
				<div class="input-file">
					<input ref="fileInputRef" type="file" :id="inputId" :name="name" :accept="accept" multiple @change="handleFileUpload" />

					<label :for="inputId">
						<div class="flex flex-col text-slate-400">
							<span class="formbold-drop-file"><Icon name="hugeicons:cloud-upload" class="text-3xl xl:text-7xl" /></span>
							<span class="text-2xl xl:text-4xl font-bold">Browse Files</span>
							<span class="mt-2 xl:mt-4 text-xs font-bold">Upload up to {{ maxFiles }} files</span>
							<span class="text-xs font-bold">Maximum file size: {{ maxSizeMb }}MB</span>
						</div>
					</label>
				</div>

				<p v-if="fileMessage" class="text-xs text-red-500">{{ fileMessage }}</p>

				<div v-if="files.length" class="flex flex-col gap-2">
					<div v-for="(file, index) in files" :key="index" class="p-4 rounded-xl flex justify-between items-center" :class="file.error ? 'bg-red-100' : 'bg-slate-100'">
						<div>
							<p>{{ file.name }}</p>
							<p class="text-xs">{{ file.size }}</p>
							<p v-if="file.error" class="text-xs text-red-500">{{ file.error }}</p>
						</div>

						<Icon v-if="!file.error" @click="removeFile(index)" name="material-symbols:delete-outline-rounded" class="text-lg text-red-500 cursor-pointer" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
let errorTimeout = null

const props = defineProps({
	label: String,
	name: String,
	description: String,
	maxFiles: { type: Number, default: 1 },
	accept: { type: String, default: '' },
	maxSizeMb: { type: Number, default: 20 },
	modelValue: { type: Array, default: () => [] },
	required: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const fileInputRef = ref(null)
const fileMessage = ref('')
const files = ref([...props.modelValue])

const inputId = computed(() => `${props.name}-upload`)

watch(files, () => {
	emit('update:modelValue', files.value)
}, { deep: true })

const formatFileSize = size => {
	const k = 1024
	const i = Math.floor(Math.log(size) / Math.log(k))
	return `${(size / Math.pow(k, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB'][i]}`
}

const validateFile = file => {
	const maxSize = props.maxSizeMb * 1024 * 1024
	const ext = file.name.split('.').pop().toLowerCase()

	if (props.accept && !props.accept.includes(ext)) {
		return 'Invalid file type'
	}
	if (file.size > maxSize) {
		return `File exceeds ${props.maxSizeMb}MB`
	}
	return ''
}

const clearErrorsWithDelay = (delay = 3000) => {
	if (errorTimeout) {
		clearTimeout(errorTimeout)
	}

	errorTimeout = setTimeout(() => {
		fileMessage.value = ''

		files.value = files.value.filter(f => !f.error)

		errorTimeout = null
	}, delay)
}

const handleFileUpload = e => {
	const selected = Array.from(e.target.files)
	const currentCount = files.value.filter(f => !f.error).length

	// 🚫 Max files reached
	if (currentCount >= props.maxFiles) {
		fileMessage.value = `Maximum ${props.maxFiles} files allowed`
		clearErrorsWithDelay()
		resetFileInput()
		return
	}

	selected.forEach(file => {
		if (files.value.length >= props.maxFiles) return

		// 🚫 Duplicate
		if (isDuplicateFile(file)) {
			fileMessage.value = `File "${file.name}" is already uploaded`
			clearErrorsWithDelay()
			resetFileInput()
			return
		}

		const error = validateFile(file)

		files.value.push({
			file,
			name: file.name,
			size: formatFileSize(file.size),
			error,
		})

		if (!error) {
			fileMessage.value = ''
		} else {
			clearErrorsWithDelay()
			resetFileInput()
		}
	})

	// ✅ Always reset at the end too
	resetFileInput()
}



const removeFile = index => {
	files.value.splice(index, 1)
	fileMessage.value = ''
}

const isDuplicateFile = (file) => {
	return files.value.some(f =>
		f.file &&
		f.file.name === file.name &&
		f.file.size === file.size &&
		f.file.lastModified === file.lastModified
	)
}

const resetFileInput = () => {
	if (fileInputRef.value) {
		fileInputRef.value.value = ''
	}
}
</script>
