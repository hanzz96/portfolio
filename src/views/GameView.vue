<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ScrollText } from "@lucide/vue";
import GalleryModal from "../components/GalleryModal.vue";
import GamePanel from "../components/GamePanel.vue";
import { useGallery } from "../composables/useGallery.js";

const emit = defineEmits(["switch-view"]);

const host = ref(null);
const activePanel = ref(null);
const showHelp = ref(true);
const { gallery, open: openGallery, close: closeGallery, prev, next } = useGallery();

const isTouch = window.matchMedia("(pointer: coarse)").matches;
const helpText = isTouch
  ? "Tap to walk · tap a building to open it"
  : "WASD / arrows or click to walk · press E at a door to open it";

let game = null;
let disposed = false;
let helpTimer = null;

onMounted(async () => {
  document.documentElement.classList.add("game-active");
  helpTimer = window.setTimeout(() => (showHelp.value = false), 9000);

  try {
    const { createGame } = await import("../game/createGame.js");
    if (disposed) return;
    game = createGame({
      root: host.value,
      baseUrl: import.meta.env.BASE_URL,
      onOpen: (id) => {
        showHelp.value = false;
        activePanel.value = id;
      },
    });
  } catch (error) {
    console.error("Game failed to start, falling back to the classic view.", error);
    emit("switch-view", "classic");
  }
});

onBeforeUnmount(() => {
  disposed = true;
  window.clearTimeout(helpTimer);
  document.documentElement.classList.remove("game-active");
  game?.destroy();
});

function closePanel() {
  activePanel.value = null;
  game?.setPaused(false);
}

function onOpenGallery(company, items) {
  openGallery(company, items);
}
</script>

<template>
  <div class="game-view">
    <div ref="host" class="game-host" role="img" aria-label="Interactive 2D town. Each building opens a section of the portfolio." />

    <p :class="['game-help', { 'is-hidden': !showHelp }]" aria-live="polite">{{ helpText }}</p>

    <button type="button" class="view-switch" @click="emit('switch-view', 'classic')">
      <ScrollText :size="18" /> Classic view
    </button>

    <GamePanel v-if="activePanel" :id="activePanel" @close="closePanel" @open-gallery="onOpenGallery" />

    <GalleryModal
      v-if="gallery"
      :company="gallery.company"
      :gallery="gallery.items"
      :index="gallery.index"
      @close="closeGallery"
      @prev="prev"
      @next="next"
    />
  </div>
</template>
