import {IAuthResponse} from "../../models/IManagerModel";
import {createAsyncThunk, createSlice, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {authService} from "../../services/auth.api.service";
import {ILogin} from "../../models/ILogin";
import {AxiosError} from "axios";

interface IState {
  data: IAuthResponse | null;
  isAuth: boolean
  error: boolean
}

const loadAuthData = (): IState => {
  const savedData = localStorage.getItem('authData');
  if (savedData) {
    return JSON.parse(savedData);
  }
  return {
    data: null,
    isAuth: false,
    error: false
  };
};

const initialState: IState = loadAuthData();

const login = createAsyncThunk(
  'managerSlice/login',
  async (authData: ILogin, thunkAPI) => {
    try {
      const {response, isAuth} = await authService.login(authData);
      thunkAPI.dispatch(managerActions.changeAuthState(isAuth))
      return thunkAPI.fulfillWithValue(response)
    } catch (e) {
      const error = e as AxiosError;
      return thunkAPI.rejectWithValue(error.response?.data)
    }
  }
)
export const managerSlice = createSlice({
  name: "managerSlice",
  initialState,
  reducers: {
    changeAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
      if (state.isAuth && state.data) {
        localStorage.setItem('authData', JSON.stringify(state));
      } else {
        localStorage.removeItem('authData');
      }
    },
  },
  extraReducers: builder =>
    builder.addCase(login.fulfilled, ((state, action) => {
      if (action.payload) {
        state.data = action.payload;
        state.error = false;
        localStorage.setItem('authData', JSON.stringify(state));
      }
    }))
      .addMatcher(isRejected(login), state => {
        state.error = true
      })
})

export const managerActions = {
  ...managerSlice.actions,
  login
}