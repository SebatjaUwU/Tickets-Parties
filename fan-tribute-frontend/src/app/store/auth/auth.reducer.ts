import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/models';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isVerifying2FA: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isVerifying2FA: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, AuthActions.register, AuthActions.googleLogin,
    state => ({ ...state, loading: true, error: null })),

  on(AuthActions.loginSuccess, AuthActions.registerSuccess, AuthActions.googleLoginSuccess,
    (state, { tokens }) => ({
      ...state,
      user: tokens.user,
      accessToken: tokens.accessToken,
      loading: false,
      error: null,
    })),

  on(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.googleLoginFailure,
    (state, { error }) => ({ ...state, loading: false, error })),

  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),

  on(AuthActions.logout, () => initialState),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
  })),
);
