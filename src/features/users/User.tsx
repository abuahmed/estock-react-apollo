import { useEffect } from "react";
import Box from "@material-ui/core/Box";
import { NavLink as RouterLink } from "react-router-dom";

import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchRoles, getUser, selectUsers } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import Toast from "../../components/Layout/Toast";
import { Button, Divider, Typography } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { Backspace } from "@material-ui/icons";

import { changePageTitle } from "../settings/settingsSlice";
import { fetchWarehouses, selectSetups } from "../setups/setupSlices";
import { UserWarehouses } from "./components/UserWarehouses";
import { UserRoles } from "./components/UserRoles";

export const User = () => {
  const { id: userId } = useParams() as {
    id: string;
  };

  const { selectedUser, error } = useAppSelector(selectUsers);
  const { warehouses } = useAppSelector(selectSetups);
  const { roles } = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(changePageTitle(`Manage User`));
    dispatch(fetchRoles("all"));
    dispatch(fetchWarehouses({ parent: "Organization", parentId: 2 }));
  }, [dispatch]);

  useEffect(() => {
    if (userId && warehouses.length > 0 && roles.length > 0) {
      dispatch(getUser(parseInt(userId)));
    }
  }, [dispatch, userId, warehouses, roles]);

  return (
    <>
      <Helmet>
        <title> {`${selectedUser?.name.toUpperCase()} Roles`}</title>
      </Helmet>
      <Box m={1} px={2}>
        <Button
          color="secondary"
          variant="contained"
          component={RouterLink}
          to={"/app/users"}
        >
          <Typography
            variant="h5"
            component="h5"
            sx={{ display: "flex", justifyItems: "center" }}
          >
            <Backspace /> back to users list
          </Typography>
        </Button>
        <Divider variant="middle" sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Typography
              color="primary"
              variant="h4"
              component="div"
              sx={{ textTransform: "uppercase" }}
            >
              Name: {selectedUser?.name}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography color="primary" variant="h4" component="div">
              Email: {selectedUser?.email}
            </Typography>
          </Grid>
        </Grid>

        <Divider variant="middle" sx={{ my: 2 }} />

        <Divider sx={{ my: 2 }}>
          <Typography color="primary" variant="h5" component="div">
            Manage Warehouses
          </Typography>
        </Divider>
        <UserWarehouses userId={parseInt(userId)} />
        <Divider sx={{ my: 2 }}>
          <Typography color="primary" variant="h5" component="div">
            Manage Roles
          </Typography>
        </Divider>
        <UserRoles userId={parseInt(userId)} />

        {error && <Toast severity="error">{error.message}</Toast>}
      </Box>
    </>
  );
};
