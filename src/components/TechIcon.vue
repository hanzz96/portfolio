<script setup>
import { computed } from "vue";
import { brandIcons, fallbackIcons } from "../data/icons.js";
import { readableBrandColor } from "../lib/color.js";

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: Number, default: 16 },
});

const brand = computed(() => brandIcons[props.icon]);
const fallback = computed(() => fallbackIcons[props.icon]);
// On hover the icon takes its brand color; very dark brand colors fall back to a light tint.
const style = computed(() => {
  const hex = brand.value?.hex ?? fallback.value?.hex;
  return hex ? { "--brand": readableBrandColor(hex) } : undefined;
});
</script>

<template>
  <svg
    v-if="brand"
    class="tech-icon"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    :style="style"
  >
    <path :d="brand.path" />
  </svg>
  <component :is="fallback.component" v-else-if="fallback" class="tech-icon" :size="size" aria-hidden="true" :style="style" />
</template>
