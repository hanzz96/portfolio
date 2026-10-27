<script setup>
import { TerminalSquare } from "@lucide/vue";
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
        <li>
          <strong>01</strong>
          <span>Backend strength: APIs, payment gateways, ERP workflows, reporting, Redis safeguards, Kafka messaging, and SQL performance.</span>
        </li>
        <li>
          <strong>02</strong>
          <span>Fullstack delivery: React, Vue, Nuxt, Laravel, Node.js, reusable components, vendor portals, and production-ready admin tools.</span>
        </li>
        <li>
          <strong>03</strong>
          <span>Creative edge: Game Engine learning, strong interest in game-inspired interfaces, game mechanics implementation, and animated UI interfaces for website.</span>
        </li>
      </ol>
    </div>
    <div class="stack-panel" data-reveal>
      <p class="section-kicker">Skill loadout</p>
      <h2>Modern web stack with serious backend damage.</h2>
      <div class="stack-list">
        <span v-for="item in stack" :key="item">{{ item }}</span>
      </div>
    </div>
  </section>
</template>
