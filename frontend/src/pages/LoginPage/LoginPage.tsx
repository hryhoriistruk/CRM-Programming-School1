import React, {useEffect} from 'react';
import LoginForm from "../../components/LoginForm/LoginForm";
import styles from './LoginPage.module.css'
import {useNavigate} from "react-router-dom";
import {authService} from "../../services/auth.api.service";
import {retrieveLocalStorageData} from "../../_helpers/helpers";
import {ITokenPair} from "../../models/ITokenPair";

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const validateToken = async () => {
      const token = retrieveLocalStorageData<ITokenPair>('tokenPair').accessToken;
      if (token) {
        try {
          const response = await authService.checkToken();
          if (response === 200) {
            navigate('/orders');
          } else {
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Token validation failed', error);
          localStorage.removeItem('accessToken');
        }
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <div className={styles.loginPage}>
      <LoginForm/>
    </div>
  );
};

export default LoginPage;