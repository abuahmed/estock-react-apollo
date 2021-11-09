import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { selectAuth } from "../../features/auth/authSlice";
import { logout } from "../../features/auth/authSlice";
import { selectPreference } from "../../features/preferences/preferencesSlice";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Search from "../search/Search";
import { Box } from "@mui/material";

function NavbarContent() {
  const { user } = useAppSelector(selectAuth);
  const { pageTitle, searchText } = useAppSelector(selectPreference);
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const logoutHandler = () => {
    dispatch(logout());
    handleMenuClose();
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {[
        <MenuItem
          key="11"
          onClick={handleMenuClose}
          component={NavLink}
          to="/app/profile"
        >
          View Profile
        </MenuItem>,
        <MenuItem key="13" onClick={logoutHandler}>
          Log out
        </MenuItem>,
      ]}
    </Menu>
  );

  return (
    <>
      <Typography sx={{ fontWeight: 500 }} variant="h4" noWrap>
        {pageTitle}
      </Typography>
      <Box sx={{ flex: "1 1 auto" }} />
      <Toolbar disableGutters>
        <Search initialValue={searchText} />
      </Toolbar>

      <div style={{ display: "flex" }}>
        {/* <IconButton color="inherit" style={{ marginLeft: 0 }}>
        <Badge badgeContent={4} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      <IconButton color="inherit">
        <Badge badgeContent={17} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton> */}

        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          size="large"
        >
          <Avatar
            alt="avatar"
            src={user ? user.avatar : ""}
            sx={{
              height: 20,
              width: 20,
            }}
          />
        </IconButton>
      </div>
      {renderMenu}
    </>
  );
}

export default NavbarContent;
