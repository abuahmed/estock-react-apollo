import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchWarehouses,
  selectSetups,
} from "../../features/setups/setupSlices";
import { Warehouse } from "../../features/setups/types/warehouseTypes";

interface Props {
  setWarehouseId?: any;
  setToWarehouseId?: any;
}
export const WarehouseFilter = ({
  setWarehouseId,
  setToWarehouseId,
}: Props) => {
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
        id={setToWarehouseId ? "selectedToWarehouseId" : "selectedWarehouseId"}
        options={warehouses}
        value={selectedWarehouse}
        getOptionLabel={(option) => option.displayName as string}
        sx={{ mt: 1 }}
        onChange={(e, value) => {
          setSelectedWarehouse(value as Warehouse);
          if (setWarehouseId) setWarehouseId(value?.id as number);
          else if (setToWarehouseId) setToWarehouseId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField
            label={setToWarehouseId ? "Destination" : "Warehouse"}
            name={
              setToWarehouseId ? "selectedToWarehouseId" : "selectedWarehouseId"
            }
            {...params}
          />
        )}
      />
    </>
  );
};
