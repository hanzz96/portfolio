<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Briefcase, Code2, Download, Images, Mail, MapPin, X } from "@lucide/vue";
import TechIcon from "./TechIcon.vue";
import { experience } from "../data/experience.js";
import { links, loadout, profile } from "../data/profile.js";
import { projects } from "../data/projects.js";
import { stack } from "../data/stack.js";
import { asset } from "../lib/asset.js";

const props = defineProps({ id: { type: String, required: true } });
const emit = defineEmits(["close", "open-gallery"]);

const kickers = {
  about: profile.introKicker,
  projects: "Mission log",
  experience: "Campaign timeline",
  skills: "Skill loadout",
  contact: "Ready for next mission",
};

const panel = ref(null);
const closeButton = ref(null);

function focusables() {
  return [...panel.value.querySelectorAll("a[href], button:not([disabled])")];
}

function onKeydown(event) {
  // The gallery modal handles its own Escape; leave the panel open underneath it.
  if (event.key === "Escape" && !document.querySelector(".gallery-overlay")) {
    emit("close");
    return;
  }
  if (event.key !== "Tab" || document.querySelector(".gallery-overlay")) return;

  const items = focusables();
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  closeButton.value?.focus();
});

onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div class="gp-backdrop" @click.self="emit('close')">
    <section ref="panel" class="gp-panel" role="dialog" aria-modal="true" :aria-labelledby="`gp-kicker-${props.id}`">
      <header class="gp-head">
        <p :id="`gp-kicker-${props.id}`" class="section-kicker">{{ kickers[props.id] }}</p>
        <button ref="closeButton" type="button" class="gp-close" aria-label="Close" @click="emit('close')">
          <X :size="20" />
        </button>
      </header>

      <div class="gp-body">
        <template v-if="props.id === 'about'">
          <h2>{{ profile.introHeading }}</h2>
          <p class="gp-text">{{ profile.introText }}</p>
          <dl class="gp-facts">
            <div>
              <dt>Focus</dt>
              <dd>{{ profile.focus }}</dd>
            </div>
            <div>
              <dt>Spawn point</dt>
              <dd><MapPin :size="14" /> {{ profile.location }}</dd>
            </div>
          </dl>
          <a class="button secondary" :href="asset(links.resume)">
            <Download :size="18" /> Download CV
          </a>
        </template>

        <template v-else-if="props.id === 'projects'">
          <h2>Production systems I have shipped</h2>
          <article v-for="project in projects" :key="project.title" class="gp-card">
            <p class="gp-meta">{{ project.type }}</p>
            <h3>{{ project.title }}</h3>
            <p class="gp-metric">{{ project.metric }}</p>
            <p class="gp-text">{{ project.text }}</p>
            <div class="tags">
              <small v-for="tag in project.tags" :key="tag">{{ tag }}</small>
            </div>
          </article>
        </template>

        <template v-else-if="props.id === 'experience'">
          <h2>5+ years leveling up production software</h2>
          <article v-for="item in experience" :key="item.company" class="gp-card">
            <p class="gp-meta">{{ item.period }}</p>
            <h3>{{ item.company }}</h3>
            <p class="gp-metric">{{ item.role }}</p>
            <p class="gp-text">{{ item.text }}</p>
            <button
              v-if="item.gallery"
              type="button"
              class="button secondary gp-gallery"
              :aria-label="`View ${item.company} portfolio screenshots`"
              @click="emit('open-gallery', item.company, item.gallery)"
            >
              <Images :size="16" /> View portfolio · {{ item.gallery.length }}
            </button>
          </article>
        </template>

        <template v-else-if="props.id === 'skills'">
          <h2>Modern web stack with serious backend damage.</h2>
          <ol class="gp-loadout">
            <li v-for="(item, index) in loadout" :key="item">
              <strong>{{ String(index + 1).padStart(2, "0") }}</strong>
              <span>{{ item }}</span>
            </li>
          </ol>
          <div class="stack-list">
            <span v-for="item in stack" :key="item.name"><TechIcon :icon="item.icon" /> {{ item.name }}</span>
          </div>
        </template>

        <template v-else-if="props.id === 'contact'">
          <h2>Looking for a fullstack or backend developer who can carry production systems?</h2>
          <div class="gp-actions">
            <a class="button primary" :href="`mailto:${links.email}`"><Mail :size="18" /> {{ links.email }}</a>
            <a class="button secondary" :href="links.github" target="_blank" rel="noopener noreferrer"><Code2 :size="18" /> GitHub</a>
            <a class="button secondary" :href="links.linkedin" target="_blank" rel="noopener noreferrer"><Briefcase :size="18" /> LinkedIn</a>
            <a class="button secondary" :href="asset(links.resume)"><Download :size="18" /> Download CV</a>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
