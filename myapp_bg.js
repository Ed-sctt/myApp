// JAVASCRIPT code for myapp background page

document.addEventListener('DOMContentLoaded', function() {
    const btnSignUp = document.getElementById('btnSignUp');
    const btnSignIn = document.getElementById('btnSignIn');
    const signupPopup = document.getElementById('signupPopup');
    const signinPopup = document.getElementById('signinPopup');
    const closeSignUp = document.getElementById('closeSignUp');
    const closeSignIn = document.getElementById('closeSignIn');

    function togglePopup(popup) {
        popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'flex' : 'none';
    }

    function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const form = event.target;
        const formData = new FormData(form);

        // Assuming you have an API endpoint for signup or signin
        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Handle server response here
        })
        .catch(error => console.error('Error:', error));
    }

    btnSignUp.addEventListener('click', function() {
        togglePopup(signupPopup);
    });

    btnSignIn.addEventListener('click', function() {
        togglePopup(signinPopup);
    });

    closeSignUp.addEventListener('click', function() {
        togglePopup(signupPopup);
    });

    closeSignIn.addEventListener('click', function() {
        togglePopup(signinPopup);
    });
});
