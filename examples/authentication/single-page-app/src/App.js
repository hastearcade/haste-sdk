import React, { useEffect, useState } from 'react';
import badge from './dark-badge.svg';
import './App.css';
import { HasteClient } from '@hastearcade/web';

function App() {
  // If you are using React, consider using Context
  // for storing the HasteClient rather than State
  // This was used for simplicity.
  const [hasteClient, setHasteClient] = useState();
  const [picture, setPicture] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Note the first parameter should be changed to your client ID found
      // in the developer portal when you created your game. Typically this can
      // and should be stored as a build environment variable.
      const hasteClient = await HasteClient.build('xWs8boQ2LZ4HnM1xNlt4EqfvXTdSl7io', 'auth.dev.hastearcade.com');
      setHasteClient(hasteClient);
    };

    initialize();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (hasteClient) {
        const details = await hasteClient.getTokenDetails();
        setPicture(details.picture);
        setDisplayName(details.displayName);
        setAuthenticated(details.isAuthenticated);
      }
    };

    getToken();
  }, [hasteClient]);

  return hasteClient ? (
    <div className="App-header">
      {isAuthenticated ? (
        <div className="App-inner">
          <p>Welcome {displayName}!</p>
          <img src={picture} className="App-logo" alt="logo" />
          <button
            className="App-button"
            onClick={() => {
              hasteClient.logout();
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <img
            src={badge}
            className="App-logo"
            alt="logo"
            onClick={() => {
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
