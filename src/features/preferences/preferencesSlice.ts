import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type PreferencesState = {
  isDesktop: boolean;
  isDrawerOpen: boolean;
  isMobileDrawerOpen: boolean;
  isMiniMode: boolean;
  pageTitle: string;
  mode: PaletteMode;
  searchText: string | undefined;
};

const initialState: PreferencesState = {
  isDesktop: true,
  isDrawerOpen: false,
  isMiniMode: false,
  isMobileDrawerOpen: false,
  pageTitle: "Dashboard",
  mode: "light",
  searchText: undefined,
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleThis: (state, { payload }) => {
      switch (payload.type) {
        case "Drawer":
          state.isDrawerOpen = payload.newValue;
          break;
        case "Mini":
          state.isMiniMode = payload.newValue;
          localStorage.setItem("miniMode", payload.newValue);
          break;
        case "Mobile":
          state.isMobileDrawerOpen = payload.newValue;
          break;
      }
    },

    setSearchText: (state, { payload }) => {
      state.searchText = payload;
      localStorage.setItem("searchText", payload);
    },

    setMode: (state, { payload }) => {
      state.mode = payload;
      localStorage.setItem("mode", payload);
    },

    changePageTitle: (state, { payload }) => {
      state.pageTitle = payload;
    },
  },
  extraReducers: {},
});

export const { toggleThis, changePageTitle, setSearchText, setMode } =
  preferencesSlice.actions;

export const selectPreference = (state: RootState) =>
  state.preferences as PreferencesState;

export default preferencesSlice.reducer;
