<template>
  <span  @click="handlerClick"><slot /></span>

</template>

<script setup>

const props = defineProps({
  // route object
  href: {
    type: String,
    required: true
  },
  target: {
    type: String,
    default: "_blank"
  },
  rel: {
    type: String,
    default: 'noopener'
  }
})

function handlerClick() {
  window.open(props.href, props.target)
}
</script>

<style scoped>

</style>