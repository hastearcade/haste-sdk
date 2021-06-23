/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
let auth0 = null;

const fetchAuthConfig = () => fetch('/auth_config.json');

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: 'https://hastegame.api',
  });
};

// NEW
const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  document.getElementById('btn-logout').disabled = !isAuthenticated;
  document.getElementById('btn-login').disabled = isAuthenticated;
  // NEW - add logic to show/hide gated content after authentication
  if (isAuthenticated) {
    document.getElementById('gated-content').classList.remove('hidden');

    document.getElementById('ipt-access-token').innerHTML = await auth0.getTokenSilently();

    document.getElementById('ipt-user-profile').textContent = JSON.stringify(await auth0.getUser());
  } else {
    document.getElementById('gated-content').classList.add('hidden');
  }
};

window.loginToAuth = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
  });
};

window.logout = () => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();
  const isAuthenticated = await auth0.isAuthenticated();
  const token = await auth0.getTokenSilently();
  if (isAuthenticated) {
    // show the gated content
    fetch('http://localhost:3009/private', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    return;
  }

  // NEW - check for the code and state parameters
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    // Process the login state
    await auth0.handleRedirectCallback();

    updateUI();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, '/');
  }
};
