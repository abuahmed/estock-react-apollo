import { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
//import { useDispatch, useSelector } from 'react-redux'

// Slices
import { fetchUsers, selectUsers } from './usersSlice'
import { selectAuth } from '../auth/authSlice'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Skeleton from '@material-ui/core/Skeleton'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { changePageTitle } from '../settings/settingsSlice'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})
// Components
//import { SimpleGrid } from '@chakra-ui/core/dist'

export const Users = () => {
  const classes = useStyles()

  const dispatch = useAppDispatch()
  const { entities: users, loading } = useAppSelector(selectUsers)
  //const { user } = useAppSelector(selectAuth)

  useEffect(() => {
    dispatch(fetchUsers('all'))
    dispatch(changePageTitle('Users List'))
  }, [])
  //const notify = () => toast('Wow so easy!')

  // if (!user) {
  //   return <Redirect to="/login" />
  // }
  return (
    <>
      <Helmet>
        <title>Users | Mern Starter</title>
      </Helmet>
      <Grid container justifyContent="flex-start">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Is Admin</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading === 'pending' ? (
                <TableRow>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">
                      <Skeleton variant="rectangular" height={10} width={100} />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={10} width={100} />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.isAdmin ? 'YES' : 'NO'}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Button variant="contained" color="primary">
                          Edit
                        </Button>
                        <Button variant="contained" color="secondary">
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}
