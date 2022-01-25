const firstVault = (function () {
  const LOCK_AFTER = 120; // seconds
  let pass: undefined | string = '';
  let timeout: null | ReturnType<typeof setTimeout> = null;

  function updateTimeout() {
    timeout = setTimeout(() => {
      pass = undefined;
      timeout = null;
    }, LOCK_AFTER * 1000);
  }

  return {
    getPass() {
      if (pass) {
        updateTimeout();
      }

      return pass;
    },

    setPass(password: string) {
      pass = password;
      updateTimeout();
    },
  };
});

export default firstVault;
