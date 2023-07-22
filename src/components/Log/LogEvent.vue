<template>
  <div
    class="log-event"
    :class="{
      [`log-event_${type}`]: !!type,
    }">
    <span class="log-event__time">[{{ formatTime(time) }}]</span>
    {{ text }}
  </div>
</template>

<script>
import { LOG_EVENT_TYPES } from './LogEvent.consts';

export default {
  name: 'LogEvent',
  props: {
    text: {
      type: String,
    },
    time: {
      type: Number,
    },
    type: {
      type: String,
      validator(value) {
        return value ? Object.values(LOG_EVENT_TYPES).includes(value) : true;
      },
    },
  },
  methods: {
    formatTime(ms) {
      const date = new Date(ms);

      return date.toTimeString().slice(0, 8);
    },
  },
};
</script>

<style lang="scss">
.log-event {
  white-space: pre-line;

  &__time {
    color: gray;
  }

  &_success {
    color: #79ca79;
  }

  &_error {
    color: #f05757;
  }

  & + & {
    margin-top: 5px;
  }
}
</style>
