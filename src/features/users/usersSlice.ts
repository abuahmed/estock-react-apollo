import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../app/graphql";
import {
  GET_ALL_Users,
  GET_SELECTED_USER,
} from "../../app/services/userService/queries";
import { RootState } from "../../app/store";

import { AuthError, AuthUser } from "../auth/types/authType";

export type UsersState = {
  entities: AuthUser[];
  selectedUser: AuthUser | null;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  error: any;
};

export const fetchUsers = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("users/fetchUsers", async (_arg, thunkAPI) => {
  const { rejectWithValue, getState, requestId } = thunkAPI;

  const {
    users: { currentRequestId, loading },
  } = getState() as { users: UsersState };

  if (loading !== "pending" || requestId !== currentRequestId) {
    return;
  }

  try {
    const response = await apolloClient.query({
      query: GET_ALL_Users,
    });

    if (response && response.data && response.data.Users) {
      return response.data.Users as AuthUser[];
    }
  } catch (error) {
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});
export const getUser = createAsyncThunk<
  any,
  number,
  { rejectValue: AuthError }
>("users/getUser", async (_id, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  // const {
  //   users: { currentRequestId, loading },
  // } = getState() as { users: UsersState };

  // if (loading !== "pending" || requestId !== currentRequestId) {
  //   return;
  // }
  console.log(_id);

  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_USER,
      variables: { id: _id },
    });

    console.log(response);
    if (response && response.data && response.data.User) {
      return response.data.User as AuthUser;
    }
  } catch (error) {
    console.log("errorsdsd", error);
    const { code, stack } = error;
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return rejectWithValue({ code, message, id: uuidv4(), stack });
  }
});

const initialState: UsersState = {
  entities: [],
  selectedUser: null,
  loading: "idle",
  currentRequestId: undefined,
  error: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, { meta }) => {
      if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = meta.requestId;
      }
    });
    builder.addCase(fetchUsers.fulfilled, (state, { payload, meta }) => {
      const { requestId } = meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.entities = payload;
        state.currentRequestId = undefined;
      }
    });
    builder.addCase(fetchUsers.rejected, (state, { payload, meta, error }) => {
      const { requestId } = meta;
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
        state.error = error;
        state.currentRequestId = undefined;
      }
    });

    builder.addCase(getUser.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(getUser.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(getUser.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });
  },
});

// Selectors
export const selectUsers = (state: RootState) => state.users as UsersState;

export default usersSlice.reducer;
