import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  selectSetups,
} from "../../features/setups/setupSlices";
import { Category, CategoryType } from "../../features/setups/types/itemTypes";

interface Props {
  setItemCategoryId: any;
  setItemUomId: any;
  bpType: CategoryType;
}
export const CategoryFilter = ({
  setItemCategoryId,
  setItemUomId,
  bpType,
}: Props) => {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    displayName: "select",
  });
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const { categories, uoms } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(fetchCategories({ type: bpType, take: -1, skip: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 || uoms.length > 0) {
      if (bpType === CategoryType.ItemCategory) setCategoriesList(categories);
      else setCategoriesList(uoms);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, uoms]);
  return (
    <>
      <Autocomplete
        id="itemCategoryId"
        options={categoriesList}
        value={selectedCategory}
        getOptionLabel={(option) => option.displayName as string}
        sx={{ mt: 1 }}
        onChange={(e, value) => {
          setSelectedCategory(value as Category);
          if (bpType === CategoryType.ItemCategory)
            setItemCategoryId(value?.id as number);
          else setItemUomId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField
            label={
              bpType === CategoryType.ItemCategory
                ? "Item Category"
                : "Unit of Measure"
            }
            name="categoryId"
            {...params}
          />
        )}
      />
    </>
  );
};
