<script setup>
import { Gamepad2 } from "@lucide/vue";
import { useScrollReveal } from "../composables/useScrollReveal.js";
import { useGallery } from "../composables/useGallery.js";
import QuestProgress from "../components/QuestProgress.vue";
import GalleryModal from "../components/GalleryModal.vue";
import Hero from "../sections/Hero.vue";
import Intro from "../sections/Intro.vue";
import Work from "../sections/Work.vue";
import Timeline from "../sections/Timeline.vue";
import Process from "../sections/Process.vue";
import Contact from "../sections/Contact.vue";

const emit = defineEmits(["play"]);

useScrollReveal();
const { gallery, open, close, prev, next } = useGallery();
</script>

<template>
  <main>
    <QuestProgress />
    <Hero />
    <Intro />
    <Work />
    <Timeline @open-gallery="open" />
    <Process />
    <Contact />

    <button type="button" class="view-switch" @click="emit('play')">
      <Gamepad2 :size="18" /> Play the game
    </button>

    <GalleryModal
      v-if="gallery"
      :company="gallery.company"
      :gallery="gallery.items"
      :index="gallery.index"
      @close="close"
      @prev="prev"
      @next="next"
    />
  </main>
</template>
