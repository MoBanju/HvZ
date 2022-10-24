import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initialize } from './keycloak';
import { Container } from 'react-bootstrap';

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
  // TODO: make this look nicer.
  root.render(
    <React.StrictMode>
      <Container className='background d-flex justify-content-center align-items-center'>
        <Container className="card">
            <p>It looks like our identity provider is down. Pleae try again later.</p>
            <p>{error.message}</p>
        </Container>
      </Container>
    </React.StrictMode>
  );
})