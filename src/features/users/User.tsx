import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

// Slices
import { AuthenticatedUser as UserType } from "../auth/types/authType";

type Props = {
  user: UserType;
};

export const User = ({ user: { name, email } }: Props) => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        style={{ borderWidth: "2px" }}
      >
        <Typography style={{ fontWeight: "bold" }}>{name}</Typography>

        <Box fontSize={"sm"}>
          <Typography>{email}</Typography>
        </Box>
      </Box>
    </>
  );
};
