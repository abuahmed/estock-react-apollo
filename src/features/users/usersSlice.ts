import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { apolloClient } from "../../apollo/graphql";
import { Add_User_Roles } from "../../apollo/mutations/users";
import {
  GET_ALL_Roles,
  GET_ALL_Users,
  GET_SELECTED_USER,
} from "../../apollo/queries";
import { RootState } from "../../app/store";

import { AuthError, AuthUser, Role } from "../auth/types/authType";

export type UsersState = {
  entities: AuthUser[];
  roles: Role[];
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
  } catch (error: any) {
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
  try {
    const response = await apolloClient.query({
      query: GET_SELECTED_USER,
      variables: { id: _id },
    });

    const rolesResponse = await apolloClient.query({
      query: GET_ALL_Roles,
    });

    const rlsRes = rolesResponse.data.GetRoles as Role[];
    if (response && response.data && response.data.GetUser) {
      const userData = response.data.GetUser as AuthUser;
      const rls = userData.roles as Role[];
      const rolesRes: Role[] = [];
      for (let index = 0; index < rlsRes.length; index++) {
        const element = { ...rlsRes[index] };
        if (rls.find((rl) => element.id === rl.id)) {
          element.isPrivileged = true;
        } else {
          element.isPrivileged = false;
        }
        rolesRes.push(element);
      }
      // rlsRes.forEach((rlRes: Role, index, array) => {
      //   if (rls.find((rl) => rlRes.id === rl.id)) {
      //     console.log(rlRes);
      //     //array[index].isPrivileged = true;
      //   }
      // });
      const usData = { ...userData };
      usData.roles = rolesRes;

      //console.log(usData);
      return usData;
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
export const addUserRoles = createAsyncThunk<
  any,
  number[],
  { rejectValue: AuthError }
>("users/addUserRoles", async (arg, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;

  try {
    const response = await apolloClient.mutate({
      mutation: Add_User_Roles,
      variables: { ids: arg },
    });

    if (response && response.data && response.data.addUserRoles) {
      dispatch(getUser(arg[0]));
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
export const fetchRoles = createAsyncThunk<
  any,
  string,
  { rejectValue: AuthError }
>("users/fetchRoles", async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await apolloClient.query({
      query: GET_ALL_Roles,
    });

    if (response && response.data && response.data.GetRoles) {
      return response.data.GetRoles as Role[];
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

const initialState: UsersState = {
  entities: [],
  roles: [],
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

    builder.addCase(fetchRoles.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(fetchRoles.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.roles = payload;
    });
    builder.addCase(fetchRoles.rejected, (state, { payload, meta, error }) => {
      state.loading = "idle";
      state.error = error;
    });

    builder.addCase(addUserRoles.pending, (state, { meta }) => {
      state.loading = "pending";
    });
    builder.addCase(addUserRoles.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.selectedUser = payload;
    });
    builder.addCase(
      addUserRoles.rejected,
      (state, { payload, meta, error }) => {
        state.loading = "idle";
        state.error = error;
      }
    );
  },
});

// Selectors
export const selectUsers = (state: RootState) => state.users as UsersState;

export default usersSlice.reducer;
