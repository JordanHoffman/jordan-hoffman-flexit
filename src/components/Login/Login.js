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
      //TODO: SETUP THIS ROUTE AND CREATE NEW USER IF HES NOT IN DATABASE AND RETRIEVE SAVED DATA EXCEPT FOR ACTUAL PUZZLE SAVES!
      if (isLoggedIn) {
        //Fetch User saved data (stage completed and/or stage saved)
        try {
          const token = await getAccessTokenSilently()
          let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");

          const response = await axios.get(reqst + 'api/users/general-saved', {
            headers: {
              authorization: `Bearer ${token}`,
            }
          });
          console.log(response.data)
        }
        catch (error) {
          console.error(error)
          if (error.message && error.message === 'Login required') {
            console.log('properly caught not logged in');
          }
          else {
            console.log('login and retrieving user info failed for some other reason')
            console.log(error)
          }
        }

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
      if (error.message && error.message === 'Login required') {
        console.log('properly caught not logged in');
      }
    }
  }

  if (isLoading) {
    return (
      <div className={props.ctrClass}>
        ...Loading User Information
      </div>
    )
  }

  //NOTE: if the user actually creates their own account, there will not be a user.given_name field. 
  return (
    <div className={props.ctrClass}>
      {!isAuthenticated && <button className='login__btn' onClick={handleLogin}>Login</button>}
      {isAuthenticated && <button className='login__btn' onClick={handleLogout}>Logout</button>}
      {user && <div>Welcome {user.given_name}</div>}
      <button className='login__btn' onClick={apiCallPublic}>Public</button>
      <button className='login__btn' onClick={apiCallPrivate}>Private</button>
    </div>
  )
}

export default Login;