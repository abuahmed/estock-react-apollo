import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchBusinessPartners,
  selectSetups,
} from "../../features/setups/setupSlices";
import {
  BusinessPartner,
  BusinessPartnerType,
} from "../../features/setups/types/bpTypes";

interface Props {
  setBusinessPartnerId: any;
  bpType: BusinessPartnerType;
}
export const BusinessPartnerFilter = ({
  setBusinessPartnerId,
  bpType,
}: Props) => {
  const dispatch = useAppDispatch();
  const [selectedBusinessPartner, setSelectedBusinessPartner] =
    useState<BusinessPartner>({
      displayName: "select",
    });
  const { businessPartners } = useAppSelector(selectSetups);

  useEffect(() => {
    dispatch(fetchBusinessPartners({ type: bpType, skip: 0, take: -1 }));
  }, [bpType, dispatch]);
  return (
    <>
      <Autocomplete
        id="businessPartnerId"
        options={businessPartners}
        value={selectedBusinessPartner}
        getOptionLabel={(option) => option.displayName as string}
        sx={{ mt: 1 }}
        onChange={(e, value) => {
          setSelectedBusinessPartner(value as BusinessPartner);
          setBusinessPartnerId(value?.id as number);
        }}
        renderInput={(params) => (
          <TextField label={bpType} name="businessPartnerId" {...params} />
        )}
      />
    </>
  );
};
