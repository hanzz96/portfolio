<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ScrollText, Volume2, VolumeX } from "@lucide/vue";
import GalleryModal from "../components/GalleryModal.vue";
import GamePanel from "../components/GamePanel.vue";
import { useGallery } from "../composables/useGallery.js";
import { loadMuted, saveMuted } from "../game/preferences.js";
import { experience } from "../data/experience.js";
import { links, profile } from "../data/profile.js";
import { projects } from "../data/projects.js";
import { stack } from "../data/stack.js";

const emit = defineEmits(["switch-view"]);

const host = ref(null);
const overlay = ref(null);
const activePanel = ref(null);
const showHelp = ref(true);
const muted = ref(loadMuted());
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
      overlay: overlay.value,
      baseUrl: import.meta.env.BASE_URL,
      onOpen: (id) => {
        showHelp.value = false;
        activePanel.value = id;
      },
    });
    game.setMuted(muted.value);
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

function toggleSound() {
  muted.value = !muted.value;
  saveMuted(muted.value);
  game?.setMuted(muted.value);
}

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
    <div ref="overlay" class="game-overlay" aria-hidden="true" />

    <!-- Text version of the portfolio for screen readers and search engines; the canvas has no text. -->
    <div class="sr-only">
      <h1>{{ profile.name }}, Fullstack Developer</h1>
      <p>{{ profile.introText }}</p>
      <h2>Projects</h2>
      <ul>
        <li v-for="project in projects" :key="project.title">{{ project.title }}: {{ project.text }}</li>
      </ul>
      <h2>Experience</h2>
      <ul>
        <li v-for="item in experience" :key="item.company">
          {{ item.company }}, {{ item.role }} ({{ item.period }}): {{ item.text }}
        </li>
      </ul>
      <h2>Skills</h2>
      <p>{{ stack.join(", ") }}</p>
      <h2>Contact</h2>
      <p>
        <a :href="`mailto:${links.email}`">{{ links.email }}</a>,
        <a :href="links.github">GitHub</a>, <a :href="links.linkedin">LinkedIn</a>
      </p>
    </div>

    <p :class="['game-help', { 'is-hidden': !showHelp }]" aria-live="polite">{{ helpText }}</p>

    <button
      type="button"
      class="view-switch sound-toggle"
      :aria-pressed="!muted"
      :aria-label="muted ? 'Turn sound on' : 'Turn sound off'"
      @click="toggleSound"
    >
      <component :is="muted ? VolumeX : Volume2" :size="18" />
      <span>{{ muted ? "Sound off" : "Sound on" }}</span>
    </button>

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
