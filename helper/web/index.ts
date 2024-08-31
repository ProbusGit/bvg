const autoLoginUtil = (
    username: string,
    password: string,
  ) => `
  (function() {
    function fillAndSubmitForm() {
      try {
        const usernameInput = document.querySelector('input[name="LoginId"]');
        const passwordInput = document.querySelector('input[name="Password"]');
        const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');
    
        if (!usernameInput || !passwordInput || !submitButton) {
          throw new rError('Form elements not found');
        }
    
        console.log('Filling form...');
        usernameInput.value = '${username}';
        passwordInput.value = '${password}';
        console.log('Form filled, submitting...');
        submitButton.click(); // Trigger the click event on the submit button
      } catch (error) {
        console.error("Error filling form:", error.message);
        window.ReactNativeWebView.postMessage("Error: " + error.message);
      }
    }
  
    function checkFormReady() {
      console.log('Checking if form is ready...');
      if (document.querySelector('input[name="LoginId"]') &&
          document.querySelector('input[name="Password"]') &&
          document.querySelector('button[type="button"]')) {
        console.log('Form is ready');
        fillAndSubmitForm();
      } else {
        console.log('Form not ready, retrying...');
        setTimeout(checkFormReady, 500);
      }
    }
  
    console.log('Script injected');
    checkFormReady(); // Start checking form readiness immediately
  })();
  `;
  
  export default autoLoginUtil;
  