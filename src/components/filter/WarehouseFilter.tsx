import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchWarehouses,
  selectSetups,
} from "../../features/setups/setupSlices";
import { Warehouse } from "../../features/setups/types/warehouseTypes";

interface Props {
  setWarehouseId: any;
}
export const WarehouseFilter = ({ setWarehouseId }: Props) => {
  const dispatch = useAppDispatch();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>({
    displayName: "select",
  });
  const { warehouses } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(fetchWarehouses({ parent: "Organization", parentId: 2 }));
  }, [dispatch]);
  return (
    <>
      <Autocomplete
        id="selectedWarehouseId"
        options={warehouses}
        value={selectedWarehouse}
        getOptionLabel={(option) => option.displayName as string}
        sx={{ mt: 1 }}
        onChange={(e, value) => {
          setSelectedWarehouse(value as Warehouse);
          setWarehouseId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField label="Warehouse" name="selectedWarehouseId" {...params} />
        )}
      />
    </>
  );
};
