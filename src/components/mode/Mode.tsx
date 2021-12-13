import React from "react";
import {
  selectPreference,
  setMode,
} from "../../features/preferences/preferencesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Box, IconButton, useTheme } from "@mui/material";
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

export default function Mode() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { mode } = useAppSelector(selectPreference);

  const handleChange = () => {
    dispatch(setMode(mode === "light" ? "dark" : "light"));
  };

  return (
    <IconButton sx={{ ml: 1 }} onClick={handleChange} color="inherit">
      {theme.palette.mode === "dark" ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
}
