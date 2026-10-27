<script setup>
import { projects } from "../data/projects.js";
</script>

<template>
  <section class="section work" id="work">
    <div class="section-head" data-reveal>
      <p class="section-kicker">Mission log</p>
      <h2>Production systems I have shipped</h2>
    </div>
    <div class="project-grid">
      <article class="project-card" v-for="project in projects" :key="project.title" data-reveal>
        <div class="project-visual">
          <span>{{ project.type }}</span>
          <div class="mini-orbit" />
        </div>
        <div class="project-body">
          <p>{{ project.metric }}</p>
          <h3>{{ project.title }}</h3>
          <span>{{ project.text }}</span>
          <div class="tags">
            <small v-for="tag in project.tags" :key="tag">{{ tag }}</small>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
