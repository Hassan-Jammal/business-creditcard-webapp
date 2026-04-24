<template>
    <div ref="root" class="relative w-full">
        <!-- Trigger -->
        <div @click="toggle" :class="triggerClass">
            <div class="flex items-center gap-2">
                <img v-if="selectedItem && resolveImage(selectedItem)" :src="resolveImage(selectedItem)" width="20"
                    height="20" />

                <span class="text-base">
                    {{ selectedItem ? resolveSelectedLabel(selectedItem) : placeholder }}
                </span>
            </div>
            <Icon name="fa7-solid:angle-down" class="text-xl shrink-0" />
        </div>

        <!-- Dropdown -->
        <div v-if="open" ref="container" @scroll="handleScroll"
            class="absolute z-50 w-full bg-[#232427] mt-2 rounded-xl shadow-md max-h-52 overflow-auto">
            <!-- Search -->
            <input id="search" name="" v-if="searchable" v-model="search" type="text" placeholder="Search..."
                class="sticky top-0 w-full px-3 py-2 border-b outline-none bg-[#232427] z-10 text-sm" />

            <!-- Items -->
            <div v-for="item in visibleItems" :key="item[valueKey]" @click="select(item)"
                class="p-2 flex gap-2 items-center hover:bg-gray-600 cursor-pointer">
                <img v-if="resolveImage(item)" :src="resolveImage(item)" width="20" height="20" />

                <span class="text-sm">
                    {{ resolveLabel(item) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

/* ======================
   PROPS
====================== */
const props = defineProps({
  modelValue: [String, Number],
  items: { type: Array, required: true },
  labelKey: { type: String, required: true },
  valueKey: { type: String, required: true },
  imageKey: { type: String, default: null },
  labelResolver: { type: Function, default: null },
  selectedLabelResolver: { type: Function, default: null },
  imageResolver: { type: Function, default: null },
  placeholder: { type: String, default: 'Select' },
  searchable: { type: Boolean, default: true },
  batchSize: { type: Number, default: 20 },
  triggerClass: {type: [String, Array, Object], default: ''},
})

const emit = defineEmits(['update:modelValue'])

/* ======================
   STATE
====================== */
const open = ref(false)
const search = ref('')
const container = ref(null)
const root = ref(null)

const visibleItems = ref([])
const lastIndex = ref(0)

let activeDropdown = null

/* ======================
   COMPUTED
====================== */
const selectedItem = computed(() =>
  props.items.find(i => i[props.valueKey] === props.modelValue)
)

const filteredItems = computed(() => {
  if (!search.value) return props.items
  return props.items.filter(item =>
    String(resolveLabel(item)).toLowerCase().includes(search.value.toLowerCase())
  )
})

/* ======================
   METHODS
====================== */
const close = () => {
  open.value = false
}

const toggle = () => {
  if (activeDropdown && activeDropdown !== close) {
    activeDropdown()
  }

  open.value = !open.value
  activeDropdown = open.value ? close : null
}

const select = (item) => {
  emit('update:modelValue', item[props.valueKey])
  close()
}

const loadNext = () => {
  const batch = filteredItems.value.slice(
    lastIndex.value,
    lastIndex.value + props.batchSize
  )
  visibleItems.value.push(...batch)
  lastIndex.value += props.batchSize
}

const handleScroll = () => {
  const el = container.value
  if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    loadNext()
  }
}

const handleClickOutside = (e) => {
  if (root.value && !root.value.contains(e.target)) {
    close()
  }
}

/* ======================
   RESOLVERS
====================== */
const resolveLabel = (item) =>
  props.labelResolver ? props.labelResolver(item) : item[props.labelKey]

const resolveSelectedLabel = (item) =>
  props.selectedLabelResolver
    ? props.selectedLabelResolver(item)
    : resolveLabel(item)

const resolveImage = (item) => {
  if (!item) return null
  if (props.imageResolver) return props.imageResolver(item)
  if (!props.imageKey) return null

  const val = item[props.imageKey]
  if (!val) return null
  return val.startsWith('/') ? val : `/images/flags/${val}.svg`
}

/* ======================
   WATCHERS
====================== */
watch(filteredItems, () => {
  visibleItems.value = []
  lastIndex.value = 0
  loadNext()
})

/* ======================
   LIFECYCLE
====================== */
onMounted(() => {
  loadNext()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (activeDropdown === close) activeDropdown = null
})

</script>
