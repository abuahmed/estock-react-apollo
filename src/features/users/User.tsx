import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import { NavLink as RouterLink } from "react-router-dom";

// Slices
// import { AuthUser as UserType } from "../auth/types/authType";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addUserRoles, getUser, selectUsers } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toast from "../../components/Layout/Toast";
import {
  Button,
  Divider,
  Skeleton,
  Switch,
  Typography,
} from "@material-ui/core";

import { changePageTitle } from "../settings/settingsSlice";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import { Helmet } from "react-helmet";
import { StyledTableRow, StyledTableCell } from "../styles/tableStyles";
import { Backspace } from "@material-ui/icons";

export const User = () => {
  const { id } = useParams() as {
    id: string;
  };
  const { selectedUser, loading, error } = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  const handleChange =
    (roleId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      let userRoles = selectedUser?.roles
        .filter((r) => r.isPrivileged)
        .map((rr) => rr.id);
      if (event.target.checked) {
        userRoles?.push(roleId);
      } else {
        userRoles = userRoles?.filter((ur) => ur !== roleId);
      }
      userRoles?.unshift(parseInt(id));

      dispatch(addUserRoles(userRoles as number[]));
    };

  useEffect(() => {
    if (id) {
      dispatch(getUser(parseInt(id)));
      dispatch(changePageTitle(`List Of Roles`));
    }
  }, []);

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

        <TableContainer component={Paper} elevation={8}>
          <Table size="small" aria-label="a simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Permission</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {selectedUser &&
                selectedUser.roles &&
                selectedUser.roles.map((role) => {
                  return loading === "pending" ? (
                    <StyledTableRow>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          height={10}
                          width={100}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow key={role.id}>
                      <StyledTableCell>{role.displayName}</StyledTableCell>
                      <StyledTableCell>
                        <Switch
                          color="secondary"
                          checked={role.isPrivileged}
                          name="isPrivileged"
                          onChange={handleChange(role.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {error && <Toast severity="error">{error.message}</Toast>}
        {/* <Box component="div" pb={3} mt={3}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    disabled={!props.isValid}
                  >
                    <SaveIcon /> Save Changes
                  </Button>
                </Box> */}
      </Box>
    </>
  );
};
