// Login page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        redirectUser(currentUser.role);
        return;
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!loginForm.checkValidity()) {
            e.stopPropagation();
            loginForm.classList.add('was-validated');
            return;
        }

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Hide previous error messages
        errorMessage.classList.add('d-none');

        // Attempt login
        const result = Auth.login(email, password);

        if (result.success) {
            // Show success message briefly
            showSuccessAndRedirect(result.user);
        } else {
            // Show error message
            errorText.textContent = result.message;
            errorMessage.classList.remove('d-none');
            
            // Shake animation for error
            errorMessage.style.animation = 'shake 0.5s';
            setTimeout(() => {
                errorMessage.style.animation = '';
            }, 500);
        }
    });

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
});

function showSuccessAndRedirect(user) {
    const loginForm = document.getElementById('loginForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.role = 'alert';
    successDiv.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        ¡Inicio de sesión exitoso! Redirigiendo...
    `;
    
    loginForm.insertBefore(successDiv, loginForm.firstChild);
    
    // Redirect after 1 second
    setTimeout(() => {
        redirectUser(user.role);
    }, 1000);
}

function redirectUser(role) {
    if (role === 'admin') {
        window.location.href = 'admin/dashboard.html';
    } else if (role === 'client') {
        window.location.href = 'client/area.html';
    } else {
        window.location.href = 'index.html';
    }
}
