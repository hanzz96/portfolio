<script setup>
import { ArrowUpRight, Download, Gamepad2, MapPin, Sparkles } from "@lucide/vue";
import PixelHero from "../components/PixelHero.vue";
import { asset } from "../lib/asset.js";
</script>

<template>
  <section class="hero">
    <PixelHero />
    <nav class="nav" aria-label="Primary navigation">
      <a class="brand" href="#top" aria-label="Home">JP</a>
      <div class="nav-links">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#process">Skills</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <div class="hero-copy" id="top">
      <p class="eyebrow"><Sparkles :size="16" /> Player class: Fullstack Developer • 5+ years XP</p>
      <h1>Johan Andreas Pranoto</h1>
      <p class="hero-text">
        I am a fullstack developer from Surabaya with strong backend experience in commerce, ERP, payments,
        microservices, reporting, and real-time integrations.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="#work">
          Start campaign <ArrowUpRight :size="18" />
        </a>
        <a class="button secondary" :href="asset('resume-johan-andreas-pranoto-v2.pdf')">
          <Download :size="18" /> Download CV
        </a>
      </div>
    </div>

    <div class="hero-panel">
      <div>
        <span>Focus</span>
        <strong>Fullstack Engineering with a focus on Backend, Payments, ERP, and Scalable Systems</strong>
      </div>
      <div>
        <span>Spawn point</span>
        <strong><MapPin :size="16" /> Surabaya, East Java, Indonesia</strong>
      </div>
      <div class="drag-note">
        <Gamepad2 :size="17" />
        <span>Gaming & Code</span>
      </div>
    </div>
  </section>
</template>
