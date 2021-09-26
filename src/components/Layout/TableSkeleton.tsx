import React from "react";
import Skeleton from "@material-ui/core/Skeleton";
import Box from "@material-ui/core/Box";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../features/styles/tableStyles";
import { Stack } from "@material-ui/core";

interface TableSkeletonProps {
  numRows: number;
  numColumns: number;
}

function TableSkeleton({ numRows, numColumns }: TableSkeletonProps) {
  return (
    <>
      {new Array(numRows).fill("", 0, numRows).map((p, i) => (
        <StyledTableRow key={i}>
          {new Array(numColumns).fill("", 0, numColumns).map((p, j) => (
            <StyledTableCell key={j}>
              <Skeleton animation="wave" variant="rectangular" />
            </StyledTableCell>
          ))}

          <StyledTableCell>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={30}
                  height={30}
                />
              </Box>
              <Box>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={30}
                  height={30}
                />
              </Box>
            </Stack>
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </>
  );
}

export default TableSkeleton;
