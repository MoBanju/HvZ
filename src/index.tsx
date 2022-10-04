import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initialize } from './keycloak';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
initialize().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}).catch((error) => {
  console.log("Failed to initalize keycloak: ", error);
  root.render(
    <React.StrictMode>
      <p>Could not connect to keycloak</p>
    </React.StrictMode>
  );
})