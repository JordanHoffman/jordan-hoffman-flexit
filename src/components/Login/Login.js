import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import { API_URL } from '../../config';
import './Login.scss'


function Login(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    //Logging in and out (silently or actively) triggers an update. Store in state whether the user is authenticated. Check each update if that changes, and then do api calls accordingly.
    if (isLoggedIn !== isAuthenticated) {
      setIsLoggedIn(isAuthenticated);
    }
  })

  //Every time the user logs in or out, this fires.
  useEffect(() => {
    const getToken = async () => {
      if (isLoggedIn) {
        const token = await getAccessTokenSilently()

        console.log(token);
      }
    }
    getToken().catch(e => console.log(e));
  }, [isLoggedIn])

  const handleLogin = () => {
    loginWithRedirect();
  }

  const handleLogout = async () => {
    logout({
      returnTo: window.location.origin
    });
  }

  const apiCallPublic = () => {
    let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");
    axios.get(reqst + 'api/public')
      .then((resp) => {
        console.log(resp.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const apiCallPrivate = async () => {
    let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(reqst + 'api/private', {
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data)
    }
    catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className={props.ctrClass}>
        ...Loading User Information
      </div>
    )
  }

  return (
    <div className={props.ctrClass}>
      {!isAuthenticated && <button className='login__btn' onClick={handleLogin}>Login</button>}
      {isAuthenticated && <button className='login__btn' onClick={handleLogout}>Logout</button>}
      {user && <div>Hello {user.given_name}</div>}
      <button className='login__btn' onClick={apiCallPublic}>Public</button>
      <button className='login__btn' onClick={apiCallPrivate}>Private</button>
    </div>
  )
}

export default Login;