import { createSlice } from "@reduxjs/toolkit";
import { changePassword } from "./authSlice";
import {
  signUp,
  signIn,
  uploadFile,
  deleteFile,
  profile,
  updateProfile,
  reset,
  resend,
  forgot,
  verify,
  facebook,
  google,
} from "./authSlice";
import { AuthState } from "./types/authType";

const initialState: AuthState = {
  user: undefined,
  me: undefined,
  loading: "idle",
  currentRequestId: undefined,
  fileUploadUri: undefined,
  error: undefined,
  success: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo");
      state.user = undefined;
      state.me = undefined;
    },
    resetSuccess: (state) => {
      state.success = undefined;
    },
    // toggleDrawer: (state) => {
    //   state.drawerStatus = !state.drawerStatus
    // },
    // changePageTitle: (state, { payload }) => {
    //   state.pageTitle = payload
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(signUp.fulfilled, (state, { payload, meta }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(signUp.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(signIn.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(signIn.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.user = payload;
      state.error = undefined;
    });
    builder.addCase(signIn.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(profile.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(profile.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.me = payload;
      state.error = undefined;
    });
    builder.addCase(profile.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(updateProfile.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.me = payload;
      state.fileUploadUri = undefined;
      state.error = undefined;
    });
    builder.addCase(updateProfile.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(changePassword.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(changePassword.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(changePassword.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(google.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(google.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.user = payload;
      state.error = undefined;
    });
    builder.addCase(google.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(facebook.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(facebook.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.user = payload;
      state.error = undefined;
    });
    builder.addCase(facebook.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(forgot.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(forgot.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(forgot.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(reset.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(reset.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(reset.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(verify.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(verify.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(verify.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(resend.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(resend.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(resend.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });

    builder.addCase(uploadFile.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(uploadFile.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.me = payload;
      state.error = undefined;
    });
    builder.addCase(uploadFile.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });
    builder.addCase(deleteFile.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(deleteFile.fulfilled, (state, { payload }) => {
      state.loading = "idle";
      state.success = payload;
      state.error = undefined;
    });
    builder.addCase(deleteFile.rejected, (state, { payload }) => {
      state.loading = "idle";
      state.error = payload;
    });
  },
});

export const { logout, resetSuccess } = authSlice.actions;

export default authSlice.reducer;
