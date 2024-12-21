import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import styles from './LoginForm.module.css'
import {ILogin} from "../../models/ILogin";
import {authService} from "../../services/auth.api.service";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
  const [isAuthState, setIsAuthState] = useState<boolean>(true);
  const navigate = useNavigate();
  const {handleSubmit, register} = useForm<ILogin>({defaultValues: {
    email: 'admin@gmail.com', password: 'admin'
    }})

  const login = async (formData: ILogin) => {
    const isAuth = await authService.login(formData)
    if (isAuth) {
      navigate("/orders");
    }
    setIsAuthState(isAuth);
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBlock}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(login)}>
          <div>
            <p>Email</p>
            <input type="text" {...register('email')} placeholder={"Email"}/>
          </div>
          <div>
            <p>Password</p>
            <input type="text" {...register('password')} placeholder={"Password"}/>
          </div>
          <button>Login</button>
          <div className={styles.authError}>{!isAuthState && "Invalid email or password"}</div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;