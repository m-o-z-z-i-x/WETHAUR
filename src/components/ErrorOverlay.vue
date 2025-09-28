<script setup>
  import { onMounted, onUnmounted } from "vue"

  const props = defineProps({
    message: { type: String, default: "" },
    title: { type: String, default: "error" }
  })

  const onBackdropClick = () => {}

  onMounted(() => {
    const prev = document.body.style.overflow
    document.body.dataset.prevOverflow = prev
    document.body.style.overflow = "hidden"
  })

  onUnmounted(() => {
    const prev = document.body.dataset.prevOverflow || ""
    document.body.style.overflow = prev
    delete document.body.dataset.prevOverflow
  })

  const reload = () => {
    window.location.reload()
  }
</script>

<template>
  <div class="w-overlay" @click.self="onBackdropClick">
    <div class="w-modal w-modal--error w-modal--center anim-up" role="alertdialog" aria-modal="true" aria-label="error">
      <div class="w-modal__body">
        <div class="w-modal__title">{{ props.title }}</div>
        <div class="w-modal__text">{{ props.message }}</div>

        <button type="button" class="w-modal__hint w-link" @click="reload">refresh the page and try again</button>
      </div>
    </div>
  </div>
</template>