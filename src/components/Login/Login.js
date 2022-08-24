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
        //Fetch User saved data (stage completed and/or stage saved)
        try {
          const token = await getAccessTokenSilently()
          let reqst = API_URL ? API_URL : ('http://' + document.location.hostname + ":8080/");

          const response = await axios.get(reqst + 'api/users/general-saved', {
            headers: {
              authorization: `Bearer ${token}`,
            }
          });
          props.onLoggedInOut({
            loggedIn: true,
            token: token,
            data: response.data
          })
        }
        catch (error) {
          //I'm not even sure how a user could be logged in but their access token be rejected. They wouldn't be logged in in the first place. But this will catch it just in case.
          if (error.message && error.message === 'Login required') {
            console.log('properly caught not logged in');
            props.onLoggedInOut({loggedIn:false})
          }
          else {
            console.error('login and retrieving user info failed for some other reason')
            console.log(error)
          }
        }
      } 
      //user logged out
      else {
        props.onLoggedInOut({loggedIn: false});
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

  if (isLoading) {
    return (
      <div className={props.ctrClass}>
        ...Loading User Information
      </div>
    )
  }

  //NOTE: if the user actually creates their own account, there will not be a user.given_name field. 
  const loginMsg = user ? ('Welcome ' + user.give_name) : 'login to save progress';
  return (
    <div className={props.ctrClass}>
      <div className='login__Msg'>{loginMsg}</div>
      {!isAuthenticated && <button className='login__btn' onClick={handleLogin}>Login</button>}
      {isAuthenticated && <button className='login__btn' onClick={handleLogout}>Logout</button>}
    </div>
  )
}

export default Login;