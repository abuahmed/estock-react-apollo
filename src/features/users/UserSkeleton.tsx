import React from 'react'

// Components
//import { Box, Skeleton } from '@chakra-ui/core/dist'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const UserSkeleton = () => {
  return (
    <>
      {[...Array(10)].map((e, i) => (
        <Skeleton variant="rectangular" width={500} height={10} style={{ margin: '5px' }} />
        // <Box key={i}>
        //   {[...Array(5)].map((e, i) => (

        // <Typography key={i} component="div" variant="h4">
        //   <Skeleton />
        // </Typography>

        // <Box pt={0.5} key={i} height={11}>
        //   <Skeleton />
        //   <Skeleton width="60%" />
        // </Box>
        //   ))}
        // </Box>
      ))}
    </>
  )
}
