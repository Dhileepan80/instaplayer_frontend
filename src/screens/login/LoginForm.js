import React, { useCallback, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../globals/components/Header';
import styles from './scss/LoginForm.module.scss';
import GlobalService from '../../globals/services/GlobalService';
import { resturls } from '../../globals/utils/apiurls';
import { setRequestToken } from '../../globals/utils';

export default function LoginForm() {
  const [state, setState] = useState({
    username: '',
    password: '',
    intractedElements: {
      username: false,
      password: false,
    },
    redirect: false,
    isFormSubmitting: false,
  });

  const { username, password, intractedElements, redirect, isFormSubmitting } = state;

  const requestToken = useCallback(() => (
    new Promise((resolve) => {
      GlobalService.generalSelect(
        (respData) => {
          if (respData.success) {
            resolve(respData.request_token);
          }
        },
        resturls.requestToken, 'GET',
      ); 
    })
  ), []);

  const handleInputOnChange = useCallback((fieldName, value) => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  }, []);

  const checkErrorsForFields = useCallback(() => {
    const error = {
      nameField: '',
      passwordField: '',
    };

    if (username === '' && intractedElements.username) {
      error.nameField = 'Username is required';
    } else if (username.length < 3 && intractedElements.username) {
      error.nameField = 'Min 3 characters';
    }

    if (password === '' && intractedElements.password) {
      error.passwordField = 'Password is required';
    }

    return error;
  }, [username, password, intractedElements]);

  const errors = checkErrorsForFields();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (errors.nameField || errors.passwordField) return;

    if (username === '' && password === '') {
      setState((prevState) => ({
        ...prevState,
        intractedElements: {
          username: true,
          password: true,
        }
      }));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isFormSubmitting: true,
    }));

    const request_token = await requestToken();

    GlobalService.generalSelect(
      (respData) => {
        if (respData.success) {
          setState((prevState) => ({
            ...prevState,
            redirect: true,
            isFormSubmitting: true,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            isFormSubmitting: false,
          }));
          setRequestToken(null);
          toast.error(respData.status_message);
        }
      },
      resturls.login, 'POST', {
        username,
        password,
        request_token,
      },
    );
  };

  if (redirect) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <>
      <ToastContainer />
      <Header />

      <div className={styles.loginFormContainer}>
        <div>
          <span>Sign in</span>
          <span>Sign in to your Self Service Portal</span>

          <form onSubmit={handleFormSubmit}>
            <div>
              <input
                name="username"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => handleInputOnChange('username', e.target.value)}
                onBlur={() => {
                  setState((prevState) => ({
                    ...prevState,
                    intractedElements: {
                      ...prevState.intractedElements,
                      username: true,
                    }
                  }));
                }}
              />
              {/* {errors.nameField && ( */}
              <span className={`${styles.errorMess} ${errors.nameField ? styles.visibleErr : ''}`}>{errors.nameField || 'fallbackErr'}</span>
              {/* )} */}
            </div>
            <div>
              <input
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => handleInputOnChange('password', e.target.value)}
                onBlur={() => {
                  setState((prevState) => ({
                    ...prevState,
                    intractedElements: {
                      ...prevState.intractedElements,
                      password: true,
                    }
                  }));
                }}
              />
              {/* {errors.passwordField && ( */}
              <span className={`${styles.errorMess} ${errors.passwordField ? styles.visibleErr : ''}`}>{errors.passwordField || 'fallbackerr'}</span>
              {/* )} */}
            </div>
            <button type="submit" className={isFormSubmitting ? styles.disabledBtn : ''}>
              LOG IN
              {isFormSubmitting
                ? (
                  <div className={styles.btnLoader}></div>
                ) : (
                  null
                )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
