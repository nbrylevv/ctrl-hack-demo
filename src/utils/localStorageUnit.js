const STORAGE_NAME = 'ctrl-hack_demo';

export const localStorageUnit = {
  init() {
    localStorage.setItem(STORAGE_NAME, JSON.stringify({}));
  },
  set(value) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(value));
  },
  get() {
    const unit = localStorage.getItem(STORAGE_NAME);

    return unit ? JSON.parse(unit) : {};
  },
};
