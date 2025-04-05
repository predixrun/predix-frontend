interface ISession {
  auth_token: string;
}

export async function getToken(): Promise<ISession | null> {
  try {
    const auth_token = localStorage.getItem('auth_token');

    if (!auth_token) return null;

    return {
      auth_token
    };
  } catch (e) {
    console.error('token error:', e);
    return null;
  }
}

export async function removeSession(): Promise<void> {
  try {
    localStorage.removeItem('profile_data');
    localStorage.removeItem('auth_token');
  } catch (e) {
    console.error('session remove error:', e);
  }
} 