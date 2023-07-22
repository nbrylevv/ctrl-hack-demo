export const FieldsUpdateOrder = {
  name: 'FieldsUpdateOrder',
  data() {
    return {
      fieldsUpdateOrder: [],
    };
  },
  methods: {
    addFieldKeyToUpdateOrder(key) {
      const keyIndex = this.fieldsUpdateOrder.findIndex((orderedKey) => orderedKey === key);

      if (keyIndex >= 0) {
        this.fieldsUpdateOrder.splice(keyIndex, 1);
      }

      this.fieldsUpdateOrder.unshift(key);
    },
  },
};
