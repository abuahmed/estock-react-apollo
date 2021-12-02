import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCategories,
  selectBanks,
  selectItemCategories,
  selectSetups,
  selectUoms,
} from "../../features/setups/setupSlices";
import { Category, CategoryType } from "../../features/setups/types/itemTypes";

interface Props {
  setItemCategoryId?: any;
  setItemUomId?: any;
  setBankId?: any;
  bpType: CategoryType;
}
export const CategoryFilter = ({
  setItemCategoryId,
  setItemUomId,
  setBankId,
  bpType,
}: Props) => {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    displayName: "select",
  });
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const {} = useAppSelector(selectSetups);
  const categories = useAppSelector(selectItemCategories);
  const uoms = useAppSelector(selectUoms);
  const banks = useAppSelector(selectBanks);
  useEffect(() => {
    dispatch(fetchCategories({ type: bpType, take: -1, skip: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 || uoms.length > 0 || banks.length > 0) {
      if (bpType === CategoryType.ItemCategory) setCategoriesList(categories);
      else if (bpType === CategoryType.UnitOfMeasure) setCategoriesList(uoms);
      else setCategoriesList(banks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, uoms, banks]);
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
          else if (bpType === CategoryType.UnitOfMeasure)
            setItemUomId(value?.id as number);
          else setBankId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField
            label={
              bpType === CategoryType.ItemCategory
                ? "Item Category"
                : bpType === CategoryType.UnitOfMeasure
                ? "Unit of Measure"
                : "Bank"
            }
            name="categoryId"
            {...params}
          />
        )}
      />
    </>
  );
};
