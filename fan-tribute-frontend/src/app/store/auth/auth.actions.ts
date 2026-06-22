import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthTokens, LoginDto, RegisterDto, User } from '../../shared/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ dto: LoginDto }>(),
    'Login Success': props<{ tokens: AuthTokens }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<{ dto: RegisterDto }>(),
    'Register Success': props<{ tokens: AuthTokens }>(),
    'Register Failure': props<{ error: string }>(),

    'Google Login': props<{ idToken: string }>(),
    'Google Login Success': props<{ tokens: AuthTokens }>(),
    'Google Login Failure': props<{ error: string }>(),

    'Load User': emptyProps(),
    'Load User Success': props<{ user: User }>(),
    'Load User Failure': props<{ error: string }>(),

    'Logout': emptyProps(),

    'Update Profile': props<{ data: Partial<User> }>(),
    'Update Profile Success': props<{ user: User }>(),
    'Update Profile Failure': props<{ error: string }>(),

    'Forgot Password': props<{ email: string }>(),
    'Forgot Password Success': emptyProps(),
    'Forgot Password Failure': props<{ error: string }>(),

    'Reset Password': props<{ token: string; password: string }>(),
    'Reset Password Success': emptyProps(),
    'Reset Password Failure': props<{ error: string }>(),
  },
});
