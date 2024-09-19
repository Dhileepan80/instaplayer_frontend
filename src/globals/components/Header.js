import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import logo from '../../assets/images/logo.svg';
import styles from './Header.module.scss';
import { logout } from '../utils';

export default function Header({
  showSearch = false, searchInputValue = '', handleSearchInputOnChange = () => {},
}) {
  const history = useHistory();

  return (
    <div className={styles.headerContainer}>
      <img src={logo} alt="instaplayer_logo" onClick={() => history.push('/')} />

      <div className={showSearch ? styles.rightPanelWrapper : ''}>
        {showSearch && (
          <div className={styles.searchInputWrapper}>
            <div>
              <input
                placeholder="Search movies"
                value={searchInputValue}
                type="text"
                onChange={handleSearchInputOnChange}
              />
            </div>
            <div>
              <i className={styles.searchIcon} />
            </div>
          </div>
        )}
        {window.localStorage.getItem('request_token') && (
          <span onClickCapture={logout}>Logout</span>
        )}
      </div>
    </div>
  );
}
