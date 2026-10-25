export const DEMO_CREDENTIALS = {
  email: 'demo@ecaspian.com',
  password: 'Ecaspian@123',
  name: 'Aarav Mehta',
};

function initials(name) {
  return String(name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function authenticate({ email, password }) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const normalisedEmail = String(email ?? '')
        .trim()
        .toLowerCase();

      if (
        normalisedEmail === DEMO_CREDENTIALS.email &&
        String(password ?? '') === DEMO_CREDENTIALS.password
      ) {
        resolve({
          id: 'demo-user',
          name: DEMO_CREDENTIALS.name,
          email: DEMO_CREDENTIALS.email,
          initials: initials(DEMO_CREDENTIALS.name),
        });
      } else {
        reject(
          new Error(
            'Those details do not match our demo account. Use the credentials below to continue.',
          ),
        );
      }
    }, 650);
  });
}
