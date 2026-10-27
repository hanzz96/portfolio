<script setup>
import { ArrowUpRight, Download, Gamepad2, MapPin, Sparkles } from "@lucide/vue";
import PixelHero from "../components/PixelHero.vue";
import { links, profile } from "../data/profile.js";
import { asset } from "../lib/asset.js";

const emit = defineEmits(["play"]);
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
        <button type="button" class="nav-play" @click="emit('play')"><Gamepad2 :size="15" /> Play</button>
      </div>
    </nav>

    <div class="hero-copy" id="top">
      <p class="eyebrow"><Sparkles :size="16" /> Player class: Fullstack Developer • 5+ years XP</p>
      <h1>{{ profile.name }}</h1>
      <p class="hero-text">
        I am a fullstack developer from Surabaya with strong backend experience in commerce, ERP, payments,
        microservices, reporting, and real-time integrations.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="#work">
          Start campaign <ArrowUpRight :size="18" />
        </a>
        <a class="button secondary" :href="asset(links.resume)">
          <Download :size="18" /> Download CV
        </a>
        <button type="button" class="button accent" @click="emit('play')">
          <Gamepad2 :size="18" /> Play my portfolio
        </button>
      </div>
    </div>

    <div class="hero-panel">
      <div>
        <span>Focus</span>
        <strong>{{ profile.focus }}</strong>
      </div>
      <div>
        <span>Spawn point</span>
        <strong><MapPin :size="16" /> {{ profile.location }}</strong>
      </div>
      <div class="drag-note">
        <Gamepad2 :size="17" />
        <span>Gaming & Code</span>
      </div>
    </div>
  </section>
</template>
