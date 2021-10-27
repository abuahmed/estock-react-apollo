import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

function ItemSkeleton() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="270px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Skeleton variant="circular" width={220} height={220} />
      <Skeleton variant="rectangular" width={180} height={25} />
      <Skeleton variant="rectangular" width={150} height={20} />
    </Box>
  );
}

export default ItemSkeleton;
