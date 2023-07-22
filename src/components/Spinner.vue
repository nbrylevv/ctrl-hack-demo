<template>
  <div class="spinner" />
</template>

<script>
export default {
  name: 'Spinner',
};
</script>

<style>
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-secondary);
  border-top-color: transparent;
  border-radius: 50%;
  transform: rotate(0);
  animation: 1s spin linear infinite;
  will-change: transform;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
