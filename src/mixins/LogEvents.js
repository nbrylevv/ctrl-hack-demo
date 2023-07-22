export const LogEvents = {
  data() {
    return {
      logEvents: [],
    };
  },
  methods: {
    addLogEvent(text, type) {
      this.logEvents.unshift({
        date: Date.now(),
        text,
        type: type || undefined,
      });
    },
    clearLogEvents() {
      this.logEvents = [];
    },
  },
};
