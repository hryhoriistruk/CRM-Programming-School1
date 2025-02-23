import React from 'react';
import styles from './Header.module.css'
import {useAppSelector} from "../../redux/store";
import {authService} from "../../services/auth.api.service";
import {useNavigate} from "react-router-dom";

const Header = () => {
  const manager = useAppSelector(state => state.manager.data?.data)
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (e) {
      console.error('Error during logout:', e);
      throw e;
    }
  }

  return (
    <div className={styles.headerBlock}>
      <div>
        <p>Logo</p>
      </div>
      <div className={styles.actionsBlock}>
        <p>{manager?.surname}</p>
        <button onClick={logout}>Logout</button>
        {manager?.role === 'admin' ? <button>AdminPanel</button> : ''}
      </div>
    </div>
  );
};

export default Header;