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
    <header className={styles.headerBlock}>
      <div>
        <p className={styles.logo}>Logo</p>
      </div>
      <div className={styles.actionsBlock}>
        <p className={styles.managerName}>{manager?.surname}</p>
        {manager?.role === 'admin' ?
          <img width="48" height="48" src="https://img.icons8.com/?size=100&id=v0eXWKgkKylB&format=png&color=FFFFFF" alt="admin panel"
               className={styles.adminBtn}
               onClick={() => {
                  navigate('/admin');
               }}
          />
          : ''}
        <img width="48" height="48" src="https://img.icons8.com/?size=100&id=59781&format=png&color=FFFFFF" alt="exit"
             onClick={logout}
             className={styles.logoutBtn}
        />
      </div>
    </header>
  );
};

export default Header;