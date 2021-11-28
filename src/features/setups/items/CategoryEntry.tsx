import { useEffect, useState } from "react";
import { Form, FormikProps, Formik } from "formik";

import Button from "@mui/material/Button";

import { registerSchema } from "../validation";

import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import {
  selectSetups,
  addCategory,
  removeCategory,
  fetchCategories,
  setSelectedCategory,
} from "../setupSlices";
import { Category, CategoryType } from "../types/itemTypes";
import { FormikTextField } from "../../../components/Layout/FormikTextField";

import { Delete, Edit, Refresh } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
import { StyledTableCell, StyledTableRow } from "../../../styles/tableStyles";
import Paging from "../../../components/Layout/Paging";

let defaultCategory = {
  displayName: "",
  id: 0,
  type: CategoryType.ItemCategory,
};
interface Props {
  categoryType: CategoryType;
}
export const CategoryEntry = ({ categoryType }: Props) => {
  defaultCategory = { ...defaultCategory, type: categoryType };
  const { categories, uoms, banks, selectedCategory } =
    useAppSelector(selectSetups);
  const dispatch = useAppDispatch();

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  const [total, setTotal] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const skipRows = currentPage * rowsPerPage;
    dispatch(setSelectedCategory(defaultCategory));
    dispatch(
      fetchCategories({ type: categoryType, skip: skipRows, take: rowsPerPage })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, rowsPerPage]);
  const RefreshList = () => {
    const skipRows = currentPage * rowsPerPage;

    dispatch(
      fetchCategories({
        type: categoryType,
        skip: skipRows,
        take: rowsPerPage,
        refreshList: "refresh",
      })
    );
  };
  useEffect(() => {
    if (categoryType === CategoryType.ItemCategory) {
      setCategoriesList(categories);
    } else if (categoryType === CategoryType.UnitOfMeasure) {
      setCategoriesList(uoms);
    } else setCategoriesList(banks);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, uoms, banks]);

  const DeleteCategory = (id: number) => {
    dispatch(removeCategory({ type: categoryType, id }));
  };
  const SetSelectedCategory = (id: number) => {
    dispatch(
      setSelectedCategory(
        categoriesList.find((cat) => cat.id === id) as Category
      )
    );
  };

  return (
    <>
      <Stack justifyContent="flex-start" sx={{ m: 2 }}>
        <Formik
          enableReinitialize={true}
          initialValues={selectedCategory as Category}
          validationSchema={registerSchema}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false);
            dispatch(addCategory(values));
          }}
        >
          {(props: FormikProps<Category>) => (
            <Form>
              <Stack direction="row" sx={{ width: "100%" }}>
                <FormikTextField
                  sx={{ width: "85%" }}
                  formikKey="displayName"
                  label="Name"
                />
                <Button
                  sx={{ ml: "8px", width: "15%" }}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!props.isValid}
                >
                  <Save />
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Button color="secondary" variant="contained" onClick={RefreshList}>
            <Typography variant="h5" component="h5">
              <Refresh />
            </Typography>
          </Button>
          <Table size="small" aria-label="a simple table" sx={{ mt: 0.5 }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Display Name</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {categoriesList &&
                categoriesList.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {currentPage * rowsPerPage + index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.displayName}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            SetSelectedCategory(row ? (row.id as number) : 0)
                          }
                          size="large"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            DeleteCategory(row ? (row.id as number) : 0)
                          }
                          size="large"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={1}>
          <Paging
            total={total}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </Stack>
      </Stack>
    </>
  );
};
