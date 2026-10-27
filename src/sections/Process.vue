<script setup>
import { TerminalSquare } from "@lucide/vue";
import TechIcon from "../components/TechIcon.vue";
import { loadout } from "../data/profile.js";
import { stack } from "../data/stack.js";
</script>

<template>
  <section class="section process" id="process">
    <div class="terminal" data-reveal>
      <div class="terminal-top">
        <TerminalSquare :size="18" />
        <span>developer-loadout.ts</span>
      </div>
      <ol>
        <li v-for="(item, index) in loadout" :key="item">
          <strong>{{ String(index + 1).padStart(2, "0") }}</strong>
          <span>{{ item }}</span>
        </li>
      </ol>
    </div>
    <div class="stack-panel" data-reveal>
      <p class="section-kicker">Skill loadout</p>
      <h2>Modern web stack with serious backend damage.</h2>
      <div class="stack-list">
        <span v-for="item in stack" :key="item.name"><TechIcon :icon="item.icon" /> {{ item.name }}</span>
      </div>
    </div>
  </section>
</template>
