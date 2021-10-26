import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import {
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  RESEND_VERIFICATION_EMAIL,
  RESET_USER_PASSWORD,
  SIGN_IN,
  SIGN_IN_FACEBOOK,
  SIGN_IN_GOOGLE,
  VERIFY_EMAIL,
} from "../../apollo/mutations";

import { RootState } from "../../app/store";
import {
  RejectWithValueType,
  AuthState,
  AuthUser,
  ForgotAuth,
  NewUser,
  ResetAuth,
  UpdatePassword,
  UserCredentials,
  VerifyAuth,
  VerifyResendAuth,
} from "./types/authType";

export const signInApollo = createAsyncThunk<
  any,
  UserCredentials,
  { rejectValue: RejectWithValueType }
>("auth/signIn", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { email, password } = authUser;

  try {
    const response = await apolloClient.mutate({
      mutation: SIGN_IN,
      variables: { email: email, password: password },
    });

    if (response && response.data && response.data.authUser) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.authUser));
      return response.data.authUser as AuthUser;
    }
    //return [];
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const updateProfile = createAsyncThunk<
  any,
  AuthUser,
  { rejectValue: RejectWithValueType }
>("auth/updateProfile", async (editProfile, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  const {
    auth: { user },
  } = getState() as { auth: AuthState };

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user!.token}`,
      },
    };

    const { data } = await axios.post(
      "/api/users/profile/edit",
      editProfile,
      config
    );
    return data;
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const changePassword = createAsyncThunk<
  any,
  UpdatePassword,
  { rejectValue: RejectWithValueType }
>("auth/changePassword", async (changePass, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  const { oldPassword, password, confirmPassword } = changePass;
  const {
    auth: { user },
  } = getState() as { auth: AuthState };

  try {
    const response = await apolloClient.mutate({
      mutation: CHANGE_PASSWORD,
      variables: { userId: user?.id, oldPassword, password, confirmPassword },
});

    if (response && response.data && response.data.changePassword) {
      return response.data.changePassword as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export type GoogleIdToken = {
  idToken: string;
};

export const google = createAsyncThunk<
  any,
  GoogleIdToken,
  { rejectValue: RejectWithValueType }
>("auth/google", async (res, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { idToken } = res;
  try {
    const response = await apolloClient.mutate({
      mutation: SIGN_IN_GOOGLE,
      variables: { idToken: idToken },
    });
    if (response && response.data && response.data.googleLogin) {
      localStorage.setItem(
        "userInfo",
        JSON.stringify(response.data.googleLogin)
      );
      return response.data.googleLogin as AuthUser;
    }
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // const { data } = await axios.post("/api/users/google", { idToken }, config);
    // localStorage.setItem("userInfo", JSON.stringify(data));
    // return data;
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export type FacebookIdToken = {
  userID: string;
  accessToken: string;
};
export const facebook = createAsyncThunk<
  any,
  FacebookIdToken,
  { rejectValue: RejectWithValueType }
>("auth/facebook", async (res, thunkAPI) => {
  //console.log(res);
  const { rejectWithValue } = thunkAPI;
  const { userID, accessToken } = res;
  try {
    const response = await apolloClient.mutate({
      mutation: SIGN_IN_FACEBOOK,
      variables: { userID, accessToken },
    });

    if (response && response.data && response.data.authUser) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.authUser));
      return response.data.authUser as AuthUser;
    }
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // const { data } = await axios.post(
    //   "/api/users/facebook",
    //   { userID, accessToken },
    //   config
    // );
    // localStorage.setItem("userInfo", JSON.stringify(data));
    // return data;
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const forgot = createAsyncThunk<
  any,
  ForgotAuth,
  { rejectValue: RejectWithValueType }
>("auth/forgot", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { email } = authUser;
  try {
    const response = await apolloClient.mutate({
      mutation: FORGOT_PASSWORD,
      variables: { email: email },
    });

    if (response && response.data && response.data.forgotPassword) {
      return response.data.forgotPassword as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const reset = createAsyncThunk<
  any,
  ResetAuth,
  { rejectValue: RejectWithValueType }
>("auth/reset", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { password, confirmPassword, id, token } = authUser;

  try {
    const response = await apolloClient.mutate({
      mutation: RESET_USER_PASSWORD,
      variables: { id, token, password, confirmPassword },
    });

    if (response && response.data && response.data.resetUserPassword) {
      return response.data.resetUserPassword as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const verify = createAsyncThunk<
  any,
  VerifyAuth,
  { rejectValue: RejectWithValueType }
>("auth/verify", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { expires, id, token, signature } = authUser;
  try {
    const response = await apolloClient.mutate({
      mutation: VERIFY_EMAIL,
      variables: { id, token, expires, signature },
    });

    if (response && response.data && response.data.verifyEmail) {
      return response.data.verifyEmail as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const resend = createAsyncThunk<
  any,
  VerifyResendAuth,
  { rejectValue: RejectWithValueType }
>("auth/resend", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { id } = authUser;
  try {
    const response = await apolloClient.mutate({
      mutation: RESEND_VERIFICATION_EMAIL,
      variables: { id },
    });

    if (response && response.data && response.data.resendVerificationEmail) {
      return response.data.resendVerificationEmail as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message = error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/password/reset",
      { password, id, token, confirmPassword },
      config
    );
    return data;
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const verify = createAsyncThunk<
  any,
  VerifyAuth,
  { rejectValue: RejectWithValueType }
>("auth/verify", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { expires, id, token, signature } = authUser;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/email/verify",
      { expires, id, token, signature },
      config
    );
    return data;
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const resend = createAsyncThunk<
  any,
  VerifyResendAuth,
  { rejectValue: RejectWithValueType }
>("auth/resend", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { id } = authUser;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/email/resend",
      { id },
      config
    );
    return data;
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

// Auth selector
export const selectAuth = (state: RootState) => state.auth as AuthState;
