import { ref } from "vue";

export function useGallery() {
  const gallery = ref(null);

  function open(company, items) {
    gallery.value = { company, items, index: 0 };
  }

  function close() {
    gallery.value = null;
  }

  function step(delta) {
    const { items, index } = gallery.value;
    gallery.value = { ...gallery.value, index: (index + delta + items.length) % items.length };
  }

  return { gallery, open, close, prev: () => step(-1), next: () => step(1) };
}
