import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { selectAuth } from "../../features/auth/authSlice";
import { logout } from "../../features/auth/authReducers";
import { selectSetting } from "../../features/settings/settingsSlice";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import useStyles from "./styles";
import Search from "../search/Search";

function NavbarContent() {
  const classes = useStyles();
  const { user } = useAppSelector(selectAuth);
  const { pageTitle, searchText } = useAppSelector(selectSetting);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //if (user) dispatch(profileApollo(user!.id));
  }, []);

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
          component={Link}
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
      <Typography className={classes.title} variant="h6" noWrap>
        {pageTitle}
      </Typography>
      <div className={classes.grow} />
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
