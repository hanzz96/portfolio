<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { ChevronLeft, ChevronRight, X } from "@lucide/vue";

const props = defineProps({
  company: { type: String, required: true },
  gallery: { type: Array, required: true },
  index: { type: Number, required: true },
});

const emit = defineEmits(["close", "prev", "next"]);

function handleKey(event) {
  if (event.key === "Escape") emit("close");
  if (event.key === "ArrowLeft") emit("prev");
  if (event.key === "ArrowRight") emit("next");
}

onMounted(() => window.addEventListener("keydown", handleKey));
onUnmounted(() => window.removeEventListener("keydown", handleKey));

const item = computed(() => props.gallery[props.index]);
</script>

<template>
  <div class="gallery-overlay" @click="emit('close')">
    <div class="gallery-modal" @click.stop>
      <div class="gallery-modal-head">
        <span>{{ company }}</span>
        <button type="button" class="gallery-close" @click="emit('close')" aria-label="Close gallery">
          <X :size="20" />
        </button>
      </div>
      <div class="gallery-modal-body">
        <button
          v-if="gallery.length > 1"
          type="button"
          class="gallery-nav prev"
          @click="emit('prev')"
          aria-label="Previous image"
        >
          <ChevronLeft :size="22" />
        </button>
        <img :src="item.src" :alt="item.caption" />
        <button
          v-if="gallery.length > 1"
          type="button"
          class="gallery-nav next"
          @click="emit('next')"
          aria-label="Next image"
        >
          <ChevronRight :size="22" />
        </button>
      </div>
      <div class="gallery-modal-foot">
        <p>{{ item.caption }}</p>
        <span v-if="gallery.length > 1">{{ index + 1 }} / {{ gallery.length }}</span>
      </div>
    </div>
  </div>
</template>
