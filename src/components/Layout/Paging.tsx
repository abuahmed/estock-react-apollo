import React from "react";
import { TablePagination } from "@mui/material";

interface Props {
  total: number;
  rowsPerPage: number;
  currentPage: number;
  setRowsPerPage: any;
  setCurrentPage: any;
}

function Paging({
  total,
  rowsPerPage,
  currentPage,
  setRowsPerPage,
  setCurrentPage,
}: Props) {
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rows = parseInt(event.target.value);
    setCurrentPage(0);
    setRowsPerPage(rows);
  };
  return (
    <TablePagination
      component="div"
      count={total}
      onPageChange={handlePageChange}
      showFirstButton
      showLastButton
      rowsPerPageOptions={[5, 10, 25, 50, 100, { value: total, label: "All" }]}
      page={currentPage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleRowsPerPageChange}
      labelRowsPerPage="Number of items per page"
    ></TablePagination>
  );
}

export default Paging;
