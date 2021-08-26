import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { HasteClient } from '@hastearcade/web';

const getHaste = async () => {
  return await HasteClient.build(process.env.REACT_APP_HASTE_GAME_CLIENT_ID ?? '');
};

function App() {
  useEffect(() => {
    const authDetails = async () => {
      const client = await getHaste();
      console.log(client);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    authDetails();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
