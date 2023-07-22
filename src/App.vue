<template>
  <div id="app">
    <form
      class="controls-area"
      @submit.prevent="handleSubmit">
      <div
        v-for="(fieldValue, fieldKey) in fields"
        :key="fieldKey"
        class="controls-area__column">
        <input
          class="controls-area__input"
          :id="fieldKey"
          :value="fieldValue"
          :placeholder="$options.FIELD_PLACEHOLDERS[fieldKey]"
          :name="fieldKey"
          type="number"
          step="any"
          :readonly="requestProcessing"
          @input="event => debouncedFieldInput(event, fieldKey, fieldValue)"
          @blur="handleFieldBlur"
        />
        <label
          :for="fieldKey"
          class="controls-area__label controls-area__label_value">
          {{ fields[fieldKey] || '&nbsp;' }}
        </label>
      </div>

      <div class="controls-area__column">
        <button
          class="button button_primary controls-area__submit-button"
          :disabled="requestProcessing">
          {{ requestProcessing ? "Отправка..." : "Отправить" }}
          <Spinner
            v-if="requestProcessing"
            class="controls-area__submit-spinner" />
        </button>
        <pre class="controls-area__label controls-area__label_code">
          {{ lsUnit }}
        </pre>
      </div>
    </form>

    <LogWindow
      class="history-area"
      :events="logEvents"
    />

    <button
      class="button button_secondary log-clear-button"
      :disabled="!logEvents.length"
      @click="clearLogEvents">
      Очистить
    </button>
  </div>
</template>

<script>
import { debounce } from 'lodash';

import Spinner from './components/Spinner.vue';
import LogWindow from './components/Log/LogWindow.vue';

import { api } from './api/index';
import { localStorageUnit } from './utils/localStorageUnit';
import { FieldsUpdateOrder } from './mixins/FieldsUpdateOrder';
import { LogEvents } from './mixins/LogEvents';
import { LOG_EVENT_TYPES } from './components/Log/LogEvent.consts';

const FIELD_NAMES = {
  price: 'price',
  quantity: 'quantity',
  sum: 'sum',
};

export default {
  name: 'App',
  components: {
    Spinner,
    LogWindow,
  },
  mixins: [
    FieldsUpdateOrder,
    LogEvents,
  ],
  FIELD_PLACEHOLDERS: {
    [FIELD_NAMES.price]: 'Цена',
    [FIELD_NAMES.quantity]: 'Количество',
    [FIELD_NAMES.sum]: 'Сумма',
  },
  data() {
    return {
      // TODO: Нужно ли забирать значения из localStorage при инициализации?
      fields: {
        [FIELD_NAMES.price]: null,
        [FIELD_NAMES.quantity]: null,
        [FIELD_NAMES.sum]: null,
      },
      debouncedFieldInput: debounce(() => {}, 0),

      // TODO: Нужно ли забирать значения из localStorage при инициализации?
      nonce: 0,
      lsUnit: localStorageUnit.get(),
      requestProcessing: false,
    };
  },
  watch: {
    fields: {
      handler() {
        if (this.fieldsUpdateOrder.length === Object.keys(this.fields).length) {
          this.recalculateLastUpdatedField();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.debouncedFieldInput = debounce(this.handleFieldInput, 300);
  },
  methods: {
    logChangedField(key, value, prevValue) {
      this.addLogEvent(`Поле [${key}] изменено: ${prevValue} -> ${value}`);
    },
    logRecalculatedField(key, value, prevValue) {
      this.addLogEvent(`Поле [${key}] перерасчитано: ${prevValue} -> ${value}`);
    },

    recalculateField(key, value) {
      if (this.fields[key] !== value) {
        this.logRecalculatedField(key, value, this.fields[key]);
        this.fields[key] = value;
      }
    },
    recalculateLastUpdatedField() {
      const lastUpdatedFieldKey = this.fieldsUpdateOrder[2];

      switch (lastUpdatedFieldKey) {
        case FIELD_NAMES.price:
          this.recalculateField(lastUpdatedFieldKey, this.fields.sum / this.fields.quantity || 0);
          break;
        case FIELD_NAMES.quantity:
          this.recalculateField(lastUpdatedFieldKey, this.fields.sum / this.fields.price || 0);
          break;
        case FIELD_NAMES.sum:
          this.recalculateField(lastUpdatedFieldKey, this.fields.price * this.fields.quantity || 0);
          break;
        default:
          break;
      }
    },
    handleFieldInput(event, fieldKey, currentValue) {
      const newValue = event.target.value || 0;

      this.addFieldKeyToUpdateOrder(fieldKey);
      this.logChangedField(fieldKey, newValue, currentValue);

      this.fields[fieldKey] = newValue;
    },
    handleFieldBlur() {
      this.debouncedFieldInput.flush();
    },
    handleSubmit() {
      this.debouncedFieldInput.flush();
      this.nonce += 1;

      this.sendRequest();
    },
    async sendRequest() {
      const data = this.prepareRequestData();

      this.addLogEvent([
        `Отправка формы: ${JSON.stringify(data)}...`,
        this.prepareLsUnitMessage(),
      ].join('\n'));
      this.requestProcessing = true;

      try {
        const { success } = await api.saveForm(data);

        if (success) {
          localStorageUnit.set(data);
          this.lsUnit = data;
        }

        this.addLogEvent(
          [
            success ? 'Успешно сохранено!' : 'Не удалось сохранить!',
            this.prepareLsUnitMessage(),
          ].join('\n'),
          success ? LOG_EVENT_TYPES.success : LOG_EVENT_TYPES.error,
        );
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert('Произошла ошибка во время запроса!');
      } finally {
        this.requestProcessing = false;
      }
    },

    prepareRequestData() {
      return {
        nonce: this.nonce,
        price: this.fields.price,
        qty: this.fields.quantity,
        amount: this.fields.sum,
      };
    },
    prepareLsUnitMessage() {
      return `Состояние localStorage: ${JSON.stringify(this.lsUnit)}`;
    },
  },
};
</script>

<style lang="scss">
@import './assets/scss/fonts.css';
@import './assets/scss/variables.css';
@import './assets/scss/global.scss';
@import './assets/scss/components.scss';

#app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 0;
}

.controls-area {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #c6c6c6;
  border-radius: var(--block-border-radius);

  &__label {
    place-self: center;
    width: 100%;
    height: 100%;
    color: #7a7a7a;
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    background: #f2f2f2;

    &_value {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    &_code {
      white-space: pre-line;
    }
  }

  &__submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  &__submit-spinner {
    display: inline-block;
  }
}

.controls-area > div {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 5px;
}

.log-clear-button {
  width: 100%;
  margin-top: 10px;
}
</style>
