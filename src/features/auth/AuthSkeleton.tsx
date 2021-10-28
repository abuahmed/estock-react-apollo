import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";

function AuthSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="text" height={30} />
      <Skeleton variant="text" height={30} />
      <Divider sx={{ my: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={40} />
    </Stack>
  );
}

export default AuthSkeleton;
