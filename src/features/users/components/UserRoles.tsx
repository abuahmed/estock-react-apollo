import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addUserRoles, selectUsers } from "../usersSlice";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@material-ui/core";

import { Role } from "../../auth/types/authType";
import { Save } from "@material-ui/icons";

interface Props {
  userId: number;
}
export const UserRoles = ({ userId }: Props) => {
  const [privilegedRoles, setPrivilegedRoles] = useState<Role[]>([]);
  const { selectedUser, loading } = useAppSelector(selectUsers);
  const { roles } = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  const handleChange =
    (roleId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      let currentRole = privilegedRoles.find((w) => w.id === roleId);

      let userRoles = privilegedRoles.filter((ur) => ur.id !== roleId);
      if (event.target.checked) {
        currentRole = { ...currentRole, isPrivileged: true };
      } else {
        currentRole = { ...currentRole, isPrivileged: false };
      }

      userRoles?.push(currentRole);
      setPrivilegedRoles(
        userRoles.sort((w1, w2) => (w1.id as number) - (w2.id as number))
      );
    };

  useEffect(() => {
    if (selectedUser) {
      const allRoles = roles as Role[];
      const userRoles = selectedUser?.roles as Role[];
      const userRolesWithPriv: Role[] = [];
      for (let index = 0; index < allRoles.length; index++) {
        const element = { ...allRoles[index] };
        if (userRoles && userRoles.find((rl) => element.id === rl.id)) {
          element.isPrivileged = true;
        } else {
          element.isPrivileged = false;
        }
        userRolesWithPriv.push(element);
      }
      setPrivilegedRoles(userRolesWithPriv);
    }
  }, [selectedUser, roles]);

  const SaveUserRoles = () => {
    let userRoles = privilegedRoles
      .filter((r) => r.isPrivileged)
      .map((rr) => rr.id);

    userRoles?.unshift(userId);

    dispatch(addUserRoles(userRoles as number[]));
  };
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        {loading === "pending"
          ? new Array(20).fill("", 0, 20).map((p, i) => (
              <Grid key={i * 56789} item xs={12} sm={6} md={3} lg={2} sx={{}}>
                <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
                  <Stack
                    spacing={2}
                    sx={{ height: "100%" }}
                    justifyContent="space-between"
                  >
                    <Skeleton animation="wave" variant="rectangular" />
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={30}
                      height={30}
                    />
                  </Stack>
                </Paper>
              </Grid>
            ))
          : privilegedRoles &&
            privilegedRoles.map((role) => {
              return (
                <Grid key={role.id} item xs={12} sm={6} md={3} lg={2} sx={{}}>
                  <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
                    <Stack
                      spacing={2}
                      sx={{ height: "100%" }}
                      justifyContent="space-between"
                    >
                      <Typography>{role.displayName}</Typography>
                      <Switch
                        color="secondary"
                        checked={role.isPrivileged}
                        name="isPrivileged"
                        onChange={handleChange(role.id as number)}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
      </Grid>
      <Box component="div" pb={3} mt={3}>
        <Button
          type="submit"
          sx={{ width: "100%" }}
          color="secondary"
          variant="contained"
          onClick={SaveUserRoles}
        >
          <Save /> Assign Selected Roles to {selectedUser?.name}
        </Button>
      </Box>
    </Stack>
  );
};
