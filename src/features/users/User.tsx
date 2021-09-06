import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";

// Slices
// import { AuthUser as UserType } from "../auth/types/authType";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addUserRoles, getUser, selectUsers } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toast from "../../components/Layout/Toast";
import { Divider, Switch, TextField } from "@material-ui/core";

import AuthSkeleton from "../auth/AuthSkeleton";
import { changePageTitle } from "../settings/settingsSlice";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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
      dispatch(changePageTitle("User Detail"));
    }
  }, []);

  return (
    <Paper
      elevation={3}
      style={{
        position: "relative",
        borderRadius: 18,
      }}
    >
      {loading === "pending" ? (
        <AuthSkeleton />
      ) : (
        <Box m={1}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField value={selectedUser?.name} label="Name" disabled />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField value={selectedUser?.email} label="Email" disabled />
            </Grid>
          </Grid>

          <Divider orientation="horizontal" sx={{ m: "10px" }} />

          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Permission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedUser &&
                  selectedUser.roles &&
                  selectedUser.roles.map((role) => {
                    return (
                      <TableRow key={role.id}>
                        <TableCell>{role.displayName}</TableCell>
                        <TableCell>
                          <Switch
                            checked={role.isPrivileged}
                            name="isPrivileged"
                            onChange={handleChange(role.id)}
                          />
                        </TableCell>
                      </TableRow>
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
      )}
    </Paper>
  );
};
