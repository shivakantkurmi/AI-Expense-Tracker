// Cookie Manager Utility
// Simple cookie management without external dependencies

const cookieManager = {
  // Set a cookie
  set: (name, value, days = 7) => {
    let expire = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expire = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expire}; path=/`;
  },

  // Get a cookie
  get: (name) => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(nameEQ)) {
        const value = cookie.substring(nameEQ.length);
        try {
          return decodeURIComponent(value);
        } catch (e) {
          return value;
        }
      }
    }
    return null;
  },

  // Delete a cookie
  delete: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },

  // Clear all cookies
  clear: () => {
    document.cookie.split(';').forEach((c) => {
      const eqPos = c.indexOf('=');
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
      cookieManager.delete(name);
    });
  },
};

export default cookieManager;
