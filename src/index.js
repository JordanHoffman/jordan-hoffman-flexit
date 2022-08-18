import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from './config';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter >
    <Auth0ProviderWithHistory
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0ProviderWithHistory>
  </BrowserRouter>
);
