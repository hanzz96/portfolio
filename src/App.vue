<script setup>
import { ref } from "vue";
import "./styles.css";
import { useScrollReveal } from "./composables/useScrollReveal.js";
import QuestProgress from "./components/QuestProgress.vue";
import GalleryModal from "./components/GalleryModal.vue";
import Hero from "./sections/Hero.vue";
import Intro from "./sections/Intro.vue";
import Work from "./sections/Work.vue";
import Timeline from "./sections/Timeline.vue";
import Process from "./sections/Process.vue";
import Contact from "./sections/Contact.vue";

useScrollReveal();

const gallery = ref(null);

function openGallery(company, items) {
  gallery.value = { company, items, index: 0 };
}

function closeGallery() {
  gallery.value = null;
}

function prevImage() {
  const { items, index } = gallery.value;
  gallery.value = { ...gallery.value, index: (index - 1 + items.length) % items.length };
}

function nextImage() {
  const { items, index } = gallery.value;
  gallery.value = { ...gallery.value, index: (index + 1) % items.length };
}
</script>

<template>
  <main>
    <QuestProgress />
    <Hero />
    <Intro />
    <Work />
    <Timeline @open-gallery="openGallery" />
    <Process />
    <Contact />

    <GalleryModal
      v-if="gallery"
      :company="gallery.company"
      :gallery="gallery.items"
      :index="gallery.index"
      @close="closeGallery"
      @prev="prevImage"
      @next="nextImage"
    />
  </main>
</template>
