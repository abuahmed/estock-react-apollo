import { useEffect } from "react";
import { Helmet } from "react-helmet";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
//import { useDispatch, useSelector } from 'react-redux'

// Slices
import { fetchUsers, selectUsers } from "./usersSlice";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/core/Skeleton";
import { NavLink as RouterLink } from "react-router-dom";

import { changePageTitle } from "../settings/settingsSlice";
import Avatar from "@material-ui/core/Avatar";
import { IconButton, Stack } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";

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
  }, []);
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
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading === "pending" ? (
                <TableRow>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>

                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Avatar
                        alt="avatar"
                        src={row.avatar}
                        sx={{
                          width: 64,
                          height: 64,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>

                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
