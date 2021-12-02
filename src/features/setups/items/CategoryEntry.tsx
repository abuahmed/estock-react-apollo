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
  selectItemCategories,
  selectUoms,
  selectBanks,
  selectItemCategoriesCount,
  selectUomsCount,
  selectBanksCount,
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
  const { selectedCategory } = useAppSelector(selectSetups);
  const categories = useAppSelector(selectItemCategories);
  const uoms = useAppSelector(selectUoms);
  const banks = useAppSelector(selectBanks);
  const catCount = useAppSelector(selectItemCategoriesCount);
  const uomCount = useAppSelector(selectUomsCount);
  const banksCount = useAppSelector(selectBanksCount);
  const dispatch = useAppDispatch();

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(setSelectedCategory(defaultCategory));
    dispatch(fetchCategories({ skip: 0, take: -1 }));
  }, [dispatch]);

  const RefreshList = () => {
    dispatch(
      fetchCategories({
        skip: 0,
        take: -1,
        refreshList: "refresh",
      })
    );
  };
  useEffect(() => {
    dispatch(setSelectedCategory(defaultCategory));
    dispatch(fetchCategories({ skip: 0, take: -1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const skipRows = currentPage * rowsPerPage;
    if (categories && categoryType === CategoryType.ItemCategory) {
      setCategoriesList(categories.slice(skipRows, skipRows + rowsPerPage));
    } else if (uoms && categoryType === CategoryType.UnitOfMeasure) {
      setCategoriesList(uoms.slice(skipRows, skipRows + rowsPerPage));
    } else if (banks && categoryType === CategoryType.Bank) {
      setCategoriesList(banks.slice(skipRows, skipRows + rowsPerPage));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, uoms, banks, currentPage, rowsPerPage]);

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

  useEffect(() => {
    if (categoryType === CategoryType.ItemCategory) {
      setTotal(catCount as number);
    } else if (categoryType === CategoryType.UnitOfMeasure) {
      setTotal(uomCount as number);
    } else setTotal(banksCount as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catCount, uomCount, banksCount]);

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
