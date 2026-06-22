import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(selectAuthState, s => s.user);
export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthError = createSelector(selectAuthState, s => s.error);
export const selectAuthToken = createSelector(selectAuthState, s => s.accessToken);
export const selectIsVerifying2FA = createSelector(selectAuthState, s => s.isVerifying2FA);
