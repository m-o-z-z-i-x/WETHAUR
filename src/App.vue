<script setup>
  import "@/assets/css/theme.css"
</script>

<template>
  <div class="theme" @contextmenu.prevent @selectstart.prevent @mousedown.prevent.right>
    <RouterView />
  </div>
</template>