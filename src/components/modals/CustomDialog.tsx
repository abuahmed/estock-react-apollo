import React, { ReactNode, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

interface Props {
  children: ReactNode
  isOpen: boolean
  handleDialogClose: Function
}
function CustomDialog({ children, isOpen, handleDialogClose }: Props) {
  const [open, setOpen] = React.useState(isOpen)
  const { success } = useAppSelector(selectAuth)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    handleDialogClose()
  }

  if (success) {
    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
      <DialogTitle disableTypography sx={{ m: 0, p: 2 }}>
        {handleClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      {children}
    </Dialog>
  )
}

export default CustomDialog
