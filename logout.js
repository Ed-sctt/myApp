
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout');
  
    logoutButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-token': sessionToken // Include the actual session token
          }
        });
  
        if (response.ok) {
          alert('Logged out successfully');
          window.location.href = '/index.html';
        } else {
          alert('Failed to logout');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  