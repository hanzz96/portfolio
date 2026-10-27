<script setup>
import { Briefcase, Code2, Mail } from "@lucide/vue";
</script>

<template>
  <section class="section contact" id="contact">
    <div data-reveal>
      <p class="section-kicker">Ready for next mission</p>
      <h2>Looking for a fullstack or backend developer who can carry production systems?</h2>
    </div>
    <div class="contact-actions" data-reveal>
      <a class="button primary" href="mailto:johanandreas74@gmail.com">
        <Mail :size="18" /> johanandreas74@gmail.com
      </a>
      <a class="icon-link" href="https://github.com/hanzz96" aria-label="GitHub">
        <Code2 :size="20" />
      </a>
      <a class="icon-link" href="https://www.linkedin.com/in/johan-andreas-a08402132/" aria-label="LinkedIn">
        <Briefcase :size="20" />
      </a>
    </div>
  </section>
</template>
