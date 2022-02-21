import React, { useEffect, useState } from 'react';
import badge from './login.svg';
import './App.css';
import { HasteClient } from '@hastearcade/web';

function App() {
  // If you are using React, consider using Context
  // for storing the HasteClient rather than State
  // This was used for simplicity.

  // For the Haste Client specifically, please look at implementing
  // a provider.
  const [hasteClient, setHasteClient] = useState();
  const [picture, setPicture] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const hasteClient = HasteClient.build();
    setHasteClient(hasteClient);
  }, []);

  useEffect(() => {
    // retrieving the token details requires
    // an async call. If the user is logged in
    // then get token details will return the token
    // along with the profile details of the player
    // The token should be passed to the game server
    // with every game state change and be validated
    // by your game server.
    if (hasteClient) {
      const details = hasteClient.getTokenDetails();
      setPicture(details.picture);
      setDisplayName(details.displayName);
      setAuthenticated(details.isAuthenticated);
    }
  }, [hasteClient]);

  return hasteClient ? (
    // check and see if the user is authenticated
    // and display the appropriate 'screen' based
    // on that value. Using React state allows this
    // page to perform dynamically.
    <div className="App-header">
      {isAuthenticated ? (
        <div className="App-inner">
          <p>Welcome {displayName}!</p>
          <img src={picture} className="App-logo" alt="logo" />
          <button
            className="App-button"
            onClick={() => {
              // you should always provide a sign out
              // option in your game client to allow
              // the player to unauthenticate.
              hasteClient.logout();
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="App-inner">
          <img
            src={badge}
            className="App-logo"
            alt="logo"
            onClick={() => {
              // login will perform a redirect to the Haste
              // authentication client. Upon authentication
              // the user will be redirected back to this page.
              hasteClient.login();
            }}
          />
          <p>Click the button to login.</p>
        </div>
      )}
      <a className="App-link" href="https://github.com/hastearcade/haste-sdk" target="_blank" rel="noopener noreferrer">
        Learn More about Haste SDK
      </a>
    </div>
  ) : (
    <React.Fragment />
  );
}

export default App;
