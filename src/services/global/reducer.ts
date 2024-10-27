// import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { EStatusState } from '@/enums';
import type { IMUser, IResetPassword } from '@/interfaces/model';
import { API, C_API, KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_USER } from '@/utils';
import { nameGlobal, type StateGlobal } from './state';
// import { nameGlobal, type StateGlobal } from './state';
/**
 * RReducer class represents a reducer for global state.
 * It handles pending, fulfilled, and rejected actions.
 */
class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = async (state: StateGlobal, value) => {
      state.isLoading = true;
      state.status = EStatusState.idle;
      this.pending(state, value);
      try {
        const res = await this.action(value);
        state.isLoading = false;
        this.fulfilled(state, res);
      } catch (e) {
        state.isLoading = false;
        this.rejected(state, e);
      }
    };
  }
}
/**
 * Represents a class that handles the retrieval of a user profile.
 */
class GetProfile extends RReducer {
  public constructor(name: string) {
    super();
    this.action = async () => {
      const { data } = await API.get<IMUser>({ url: `${C_API[name]}/profile` });
      return data || {};
    };

    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.data = action.payload;
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.status = EStatusState.idle;
      }
    };
  }
}
/**
//  * Represents a class for putting a user profile.
//  */
// class PutProfile extends RReducer {
//   public constructor(name: string) {
//     super();
//     this.action = createAsyncThunk(name + '/putProfile', async (values: IMUser) => {
//       const { data } = await API.put<{ user: IMUser; token: string; refreshToken: string }>({
//         url: `${C_API[name]}/profile`,
//         values,
//       });
//       if (data) {
//         localStorage.setItem(KEY_TOKEN, data?.token);
//         localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
//       }
//       return data!.user;
//     });

//     this.pending = (state, action) => {
//       state.data = { ...state.data, ...action.meta.arg };
//     };
//     this.fulfilled = (state, action) => {
//       if (action.payload) {
//         localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
//         state.user = action.payload;
//         state.status = EStatusState.isFulfilled;
//       }
//     };
//   }
// }
/**
 * Represents a class for handling login functionality.
 * @class
 */
class PostLogin extends RReducer {
  public constructor(name: string) {
    super();
    this.action = async (values: { password: string; username: string }) => {
      const { data } = await API.post<{ user: IMUser; token: string; refreshToken: string }>({
        url: `${C_API[name]}/login`,
        values,
        params: { include: 'role' },
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    };

    this.pending = (state, value) => {
      state.data = value;
    };
    this.fulfilled = (state, data) => {
      if (data) {
        localStorage.setItem(KEY_USER, JSON.stringify(data));
        state.user = data;
        state.data = undefined;
        state.status = EStatusState.isFulfilled;
      }
    };
  }
}
// /**
//  * Represents a class for patching forgotten passwords.
//  */
// class PostForgottenPassword extends RReducer {
//   public constructor(name: string) {
//     super();
//     this.action = createAsyncThunk(name + '/forgotten-password', async (values: { email: string }) => {
//       await API.post({ url: `${C_API[name]}/forgotten-password`, values });
//       return true;
//     });

//     this.pending = (state, action) => {
//       state.data = action.meta.arg;
//     };
//     this.fulfilled = state => {
//       state.status = EStatusState.isFulfilled;
//     };
//   }
// }
// /**
//  * Represents a class for handling OTP confirmation.
//  */
// class PostOtpConfirmation extends RReducer {
//   public constructor(name: string) {
//     super();
//     this.action = createAsyncThunk(name + '/otp-confirmation', async (values: { email: string; otp: string }) => {
//       await API.post({ url: `${C_API[name]}/otp-confirmation`, values });
//       return true;
//     });

//     this.pending = (state, action) => {
//       state.data = action.meta.arg;
//     };
//     this.fulfilled = (state, action) => {
//       if (action.payload) {
//         state.status = EStatusState.isFulfilled;
//       }
//     };
//   }
// }
// /**
//  * Represents a class for resetting password using patch method.
//  */
// class PostResetPassword extends RReducer {
//   public constructor(name: string) {
//     super();
//     this.action = createAsyncThunk(name + '/reset-password', async (values: IResetPassword) => {
//       await API.post({ url: `${C_API[name]}/reset-password`, values });
//       return true;
//     });

//     this.pending = (state, action) => {
//       state.data = action.meta.arg;
//     };
//     this.fulfilled = state => {
//       state.data = {};
//       state.status = EStatusState.isFulfilled;
//     };
//   }
// }

/**
 * RGlobal is an object that contains various service methods for global functionality.
 * Each property represents a specific service method.
 */
export const RGlobal = {
  getProfile: new GetProfile(nameGlobal),
  // putProfile: new PutProfile(nameGlobal),
  postLogin: new PostLogin(nameGlobal),
  // postForgottenPassword: new PostForgottenPassword(nameGlobal),
  // postOtpConfirmation: new PostOtpConfirmation(nameGlobal),
  // postResetPassword: new PostResetPassword(nameGlobal),
};
/**
 * Represents the global state of the application.
 */
export interface GlobalState {
  isLoading?: boolean;
  user?: IMUser;
  data?: IResetPassword & IMUser;
  status?: EStatusState;
}
