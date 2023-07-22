<template>
  <div class="log-window">
    <span
      v-if="events.length === 0"
      class="log-window__empty-message">
      Нет событий
    </span>
    <LogEvent
      v-for="(event, index) in events"
      :key="index"
      :text="event.text"
      :time="event.date"
      :type="event.type" />
  </div>
</template>

<script>
import LogEvent from './LogEvent.vue';

export default {
  name: 'LogWindow',
  components: {
    LogEvent,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
.log-window {
  position: relative;
  min-height: 200px;
  padding: 10px;
  font-family: 'Source Code Pro', monospace;
  color: #e4e4e4;
  background: #282828;
  border-radius: var(--block-border-radius);
}

.log-window__clear-button {
  width: 100%;
  margin-bottom: 10px;
}

.log-window__empty-message {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 100%;
  text-align: center;
  color: grey;
  transform: translate(-50%, -50%);
}
</style>
