class Api {
  saveForm(data) {
    return new Promise((resolve) => {
      const responseValue = Math.abs(parseInt(data.qty % 2, 0)) === 0;

      return setTimeout(() => {
        resolve({ success: responseValue });
      }, 1000);
    });
  }
}

export const api = new Api();
