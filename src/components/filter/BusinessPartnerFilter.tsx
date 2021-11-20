import React, { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchBusinessPartners,
  selectSetups,
} from "../../features/setups/setupSlices";
import { BusinessPartnerType } from "../../features/setups/types/bpTypes";

interface Props {
  setBusinessPartnerId: any;
  bpType: BusinessPartnerType;
}
export const BusinessPartnerFilter = ({
  setBusinessPartnerId,
  bpType,
}: Props) => {
  const dispatch = useAppDispatch();

  const { businessPartners, selectedBusinessPartner } =
    useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(fetchBusinessPartners(bpType));
  }, [dispatch]);
  return (
    <>
      <Autocomplete
        id="businessPartnerId"
        options={businessPartners}
        value={selectedBusinessPartner}
        getOptionLabel={(option) => option.displayName as string}
        sx={{ mt: 1 }}
        onChange={(e, value) => {
          setBusinessPartnerId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField
            label="BusinessPartners"
            name="businessPartnerId"
            {...params}
          />
        )}
      />
    </>
  );
};
