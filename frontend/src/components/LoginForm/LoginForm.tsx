import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import styles from './LoginForm.module.css'
import {ILogin} from "../../models/ILogin";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {managerActions} from "../../redux/slices/managerSlice";

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const {error} = useAppSelector(state => state.manager)

  const navigate = useNavigate();
  const {handleSubmit, register, watch} = useForm<ILogin>({defaultValues: {
    email: 'admin@gmail.com', password: 'admin'
    }})

  const email = watch('email')
  const password = watch('password')

  const login = async (formData: ILogin) => {
    const response = await dispatch(managerActions.login(formData))
    if (response.payload) {
      navigate("/orders");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBlock}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(login)}>
          <div>
            <p>Email</p>
            <input type="text" {...register('email', {required: 'Email is required'})} placeholder={"Email"}/>
          </div>
          <div>
            <p>Password</p>
            <input type="text" {...register('password', { required: 'Password is required' })} placeholder={"Password"}/>
          </div>
          <button type={"submit"} disabled={!email || !password} >Login</button>
          <div className={styles.authError}>{error && "Invalid email or password"}</div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;