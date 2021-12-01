import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchItems, selectSetups } from "../../features/setups/setupSlices";
import { Item } from "../../features/setups/types/itemTypes";

interface Props {
  setItemId: any;
}
export const ItemFilter = ({ setItemId }: Props) => {
  const dispatch = useAppDispatch();
  const [selectedItem, setSelectedItem] = useState<Item>({
    displayName: "select",
  });
  const {
    itemsWithCount: { items },
  } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(fetchItems({ skip: 0 }));
  }, [dispatch]);
  return (
    <>
      <Autocomplete
        id="itemId"
        options={items}
        value={selectedItem}
        getOptionLabel={(option) => option.displayName as string}
        sx={{ mt: 1 }}
        onChange={(e, value) => {
          setSelectedItem(value as Item);
          setItemId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField label="Item" name="itemId" {...params} />
        )}
      />
    </>
  );
};
