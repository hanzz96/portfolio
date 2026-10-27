<script setup>
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
import "./styles.css";
import "./game/game.css";
import ClassicView from "./views/ClassicView.vue";

const GameView = defineAsyncComponent(() => import("./views/GameView.vue"));

// The classic page uses #hash anchors, so the view lives in the query string instead.
const readView = () => (new URLSearchParams(window.location.search).get("view") === "classic" ? "classic" : "game");
const view = ref(readView());

function setView(next) {
  if (next === view.value) return;
  const url = next === "classic" ? `${window.location.pathname}?view=classic` : window.location.pathname;
  window.history.pushState({}, "", url);
  view.value = next;
  window.scrollTo(0, 0);
}

function syncFromUrl() {
  view.value = readView();
}

onMounted(() => window.addEventListener("popstate", syncFromUrl));
onBeforeUnmount(() => window.removeEventListener("popstate", syncFromUrl));
</script>

<template>
  <ClassicView v-if="view === 'classic'" @play="setView('game')" />
  <GameView v-else @switch-view="setView" />
</template>
