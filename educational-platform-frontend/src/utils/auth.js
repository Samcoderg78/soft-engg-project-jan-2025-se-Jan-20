// Auth utility functions

export const logout = () => {
  // Clear all auth related data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = '/login';
}; 