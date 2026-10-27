<script setup>
import { useScrollProgress } from "../composables/useScrollProgress.js";

const { progress, waypoints, level, currentLabel } = useScrollProgress();
</script>

<template>
  <div :class="['quest-hud', progress > (waypoints[0]?.percent ?? 15) ? 'is-active' : '']">
    <span class="quest-hud-level">LV {{ level }}</span>
    <span class="quest-hud-label">{{ currentLabel }}</span>
  </div>
  <div
    class="scroll-progress"
    role="progressbar"
    aria-label="Quest progress"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="scroll-progress-fill" :style="{ width: progress + '%' }" />
    <span
      v-for="waypoint in waypoints"
      :key="waypoint.id"
      :class="['scroll-waypoint', progress >= waypoint.percent - 1 ? 'is-passed' : '']"
      :style="{ left: waypoint.percent + '%' }"
      :title="waypoint.label"
    />
    <span class="scroll-marker" :style="{ left: progress + '%' }" aria-hidden="true" />
  </div>
</template>
