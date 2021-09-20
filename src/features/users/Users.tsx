import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers, selectUsers } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import { NavLink as RouterLink } from "react-router-dom";

import { changePageTitle } from "../settings/settingsSlice";
import Avatar from "@material-ui/core/Avatar";
import { IconButton, Stack } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import { StyledTableCell, StyledTableRow } from "../styles/tableStyles";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
// Components
//import { SimpleGrid } from '@chakra-ui/core/dist'

export const Users = () => {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { entities: users, loading } = useAppSelector(selectUsers);
  //const { user } = useAppSelector(selectAuth)

  useEffect(() => {
    dispatch(fetchUsers("all"));
    dispatch(changePageTitle("Users List"));
  }, [dispatch]);
  //const notify = () => toast('Wow so easy!')

  // if (!user) {
  //   return <Redirect to="/login" />
  // }

  const DeleteUser = (id: number) => {};
  return (
    <>
      <Helmet>
        <title>Users | Pinna Stock</title>
      </Helmet>
      <Grid container justifyContent="flex-start">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Photo</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <StyledTableRow>
                  <StyledTableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                users.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      <Avatar
                        alt="avatar"
                        src={row.avatar}
                        sx={{
                          width: 64,
                          height: 64,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>

                    <StyledTableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={"/app/user/" + row.id}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => DeleteUser(row.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
