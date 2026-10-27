<script setup>
import { profile } from "../data/profile.js";
</script>

<template>
  <section class="section intro">
    <div data-reveal>
      <p class="section-kicker">{{ profile.introKicker }}</p>
      <h2>{{ profile.introHeading }}</h2>
    </div>
    <p data-reveal>{{ profile.introText }}</p>
  </section>
</template>
