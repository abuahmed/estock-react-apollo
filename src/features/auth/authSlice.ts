import React from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../app/graphql";
import {
  SIGN_IN,
  SIGN_IN_FACEBOOK,
  SIGN_IN_GOOGLE,
} from "../../app/services/userService/mutations";

import { RootState } from "../../app/store";
import {
  AuthError,
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
import { PROFILE } from "../../app/services/userService/queries";
//import { sleep } from '../../utils/sleep';

export const uploadFile = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("auth/uploadImage", async (image, thunkAPI) => {
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

    const { data } = await axios.post("/api/uploads", image, config);

    //const pr = await profile(user!.id)
    //console.log(data)
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

export const uploadFileMulter = createAsyncThunk<
  any,
  File,
  { rejectValue: AuthError }
>("auth/uploadImage", async (image, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  const {
    auth: { user },
  } = getState() as { auth: AuthState };

  try {
    const formData = new FormData();
    formData.append("id", user!.id.toString());
    formData.append("image", image);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user!.token}`,
      },
    };

    const { data } = await axios.post("/api/uploads", formData, config);

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
export const deleteFile = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("auth/deleteFile", async (fileName, thunkAPI) => {
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

    const { data } = await axios.delete(
      `/api/uploads?fileName=${fileName.substring(fileName.lastIndexOf("/"))}`,
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

export const signUp = createAsyncThunk<
  any,
  NewUser,
  { rejectValue: AuthError }
>("auth/signUp", async (newUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/users", newUser, config);
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

export const updateProfile = createAsyncThunk<
  any,
  AuthUser,
  { rejectValue: AuthError }
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
  { rejectValue: AuthError }
>("auth/changePassword", async (editProfile, thunkAPI) => {
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
      "/api/users/profile/edit/password",
      { ...editProfile, userId: user?.id },
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
export const signInApollo = createAsyncThunk<
  any,
  UserCredentials,
  { rejectValue: AuthError }
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
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const signIn = createAsyncThunk<
  any,
  UserCredentials,
  { rejectValue: AuthError }
>("auth/signIn", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { email, password } = authUser;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    localStorage.setItem("userInfo", JSON.stringify(data));
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
export const profileApollo = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("auth/profile", async (id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: PROFILE,
      variables: { id: id },
    });

    if (response && response.data && response.data.getUserProfile) {
      return response.data.getUserProfile as AuthUser;
    }
  } catch (error: any) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

export const profile = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("auth/profile", async (id, thunkAPI) => {
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

    const { data } = await axios.post("/api/users/profile", { id }, config);
    //console.log(data)
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

export type GoogleIdToken = {
  idToken: string;
};

export const google = createAsyncThunk<
  any,
  GoogleIdToken,
  { rejectValue: AuthError }
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
  { rejectValue: AuthError }
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
  { rejectValue: AuthError }
>("auth/forgot", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { email } = authUser;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/password/email",
      { email },
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

export const reset = createAsyncThunk<
  any,
  ResetAuth,
  { rejectValue: AuthError }
>("auth/reset", async (authUser, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const { password, confirmPassword, id, token } = authUser;
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
  { rejectValue: AuthError }
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
  { rejectValue: AuthError }
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
