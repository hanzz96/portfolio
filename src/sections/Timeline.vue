<script setup>
import { Images } from "@lucide/vue";
import { experience } from "../data/experience.js";

const emit = defineEmits(["open-gallery"]);
</script>

<template>
  <section class="section timeline" id="experience">
    <div class="section-head" data-reveal>
      <p class="section-kicker">Campaign timeline</p>
      <h2>5+ years leveling up production software</h2>
    </div>
    <div class="timeline-list">
      <article class="timeline-item" v-for="item in experience" :key="item.company" data-reveal>
        <div>
          <span>{{ item.period }}</span>
          <h3>{{ item.company }}</h3>
        </div>
        <div>
          <div class="timeline-role">
            <strong>{{ item.role }}</strong>
            <button
              v-if="item.gallery"
              type="button"
              class="gallery-trigger"
              @click="emit('open-gallery', item.company, item.gallery)"
              :aria-label="`View ${item.company} portfolio screenshots`"
            >
              <span class="gallery-trigger-stack">
                <img
                  v-for="shot in item.gallery.slice(0, 3)"
                  :key="shot.src"
                  :src="shot.src"
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <span class="gallery-trigger-label">
                <span class="gallery-trigger-title"><Images :size="14" /> View portfolio</span>
                <span class="gallery-trigger-count">{{ item.gallery.length }} screenshots</span>
              </span>
            </button>
          </div>
          <p>{{ item.text }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
