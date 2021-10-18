import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addUserWarehouses, selectUsers } from "../usersSlice";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@material-ui/core";

import { selectSetups } from "../../setups/setupSlices";
import { Warehouse } from "../../setups/types/warehouseTypes";
import { Save } from "@material-ui/icons";
interface Props {
  userId: number;
}
export const UserWarehouses = ({ userId }: Props) => {
  const [privilegedWarehouses, setPrivilegedWarehouses] = useState<Warehouse[]>(
    []
  );
  //const [userWarehouses, setUserWarehouses] = useState<number[]>([]);
  const { selectedUser, loading } = useAppSelector(selectUsers);
  const { warehouses } = useAppSelector(selectSetups);
  const dispatch = useAppDispatch();

  const handleChangeWarehouse =
    (warehouseId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      let currentWarehouse = privilegedWarehouses.find(
        (w) => w.id === warehouseId
      );

      let userWares = privilegedWarehouses.filter(
        (ur) => ur.id !== warehouseId
      );
      if (event.target.checked) {
        currentWarehouse = { ...currentWarehouse, isPrivileged: true };
      } else {
        currentWarehouse = { ...currentWarehouse, isPrivileged: false };
      }

      userWares?.push(currentWarehouse);
      setPrivilegedWarehouses(
        userWares.sort((w1, w2) => (w1.id as number) - (w2.id as number))
      );
    };
  const CheckUnCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let userWarehousesWithPriv = privilegedWarehouses.map((pr) => ({
      ...pr,
      isPrivileged: event.target.checked,
    }));
    setPrivilegedWarehouses(userWarehousesWithPriv);
  };
  useEffect(() => {
    if (selectedUser) {
      const authUserOrAllWarehouses = warehouses as Warehouse[];
      const selectedUserWarehouses = selectedUser?.warehouses as Warehouse[];
      const userWarehousesWithPriv: Warehouse[] = [];
      for (let index = 0; index < authUserOrAllWarehouses.length; index++) {
        const element = { ...authUserOrAllWarehouses[index] };
        if (
          selectedUserWarehouses &&
          selectedUserWarehouses.find((rl) => element.id === rl.id)
        ) {
          element.isPrivileged = true;
        } else {
          element.isPrivileged = false;
        }
        userWarehousesWithPriv.push(element);
      }
      setPrivilegedWarehouses(userWarehousesWithPriv);
    }
  }, [selectedUser, warehouses]);

  const SaveUserWarehouses = () => {
    let userWarehouses = privilegedWarehouses
      .filter((r) => r.isPrivileged)
      .map((rr) => rr.id);

    userWarehouses?.unshift(userId);

    dispatch(addUserWarehouses(userWarehouses as number[]));
  };
  return (
    <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              color="secondary"
              name="isAllPrivileged"
              onChange={CheckUnCheckAll}
            />
          }
          label="Select All"
        />
      </FormGroup>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "stretch" }}
      >
        {loading === "pending"
          ? new Array(5).fill("", 0, 5).map((p, i) => (
              <Grid key={i * 12345} item xs={12} sm={6} md={3} lg={2} sx={{}}>
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
          : privilegedWarehouses &&
            privilegedWarehouses.map((ware) => {
              return (
                <Grid key={ware.id} item xs={12} sm={6} md={3} lg={2}>
                  <Paper elevation={3} sx={{ padding: 2, height: "100%" }}>
                    <Stack
                      spacing={2}
                      sx={{ height: "100%" }}
                      justifyContent="space-between"
                    >
                      <Typography>{ware.displayName}</Typography>
                      <Switch
                        color="secondary"
                        checked={ware.isPrivileged}
                        name="isPrivileged"
                        onChange={handleChangeWarehouse(ware.id as number)}
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
          onClick={SaveUserWarehouses}
        >
          <Save /> Assign Selected Warehouses to {selectedUser?.name}
        </Button>
      </Box>
    </Stack>
  );
};
