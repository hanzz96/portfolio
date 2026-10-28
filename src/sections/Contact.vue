<script setup>
import { Briefcase, Code2, Mail } from "@lucide/vue";
import { links } from "../data/profile.js";
</script>

<template>
  <section class="section contact" id="contact">
    <div data-reveal>
      <p class="section-kicker">Ready for next mission</p>
      <h2>Looking for a fullstack or backend developer who can carry production systems?</h2>
    </div>
    <div class="contact-actions" data-reveal>
      <a class="button primary" :href="`mailto:${links.email}`">
        <Mail :size="18" /> {{ links.email }}
      </a>
      <a class="icon-link" :href="links.github" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <Code2 :size="20" />
      </a>
      <a class="icon-link" :href="links.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <Briefcase :size="20" />
      </a>
    </div>
  </section>
</template>
