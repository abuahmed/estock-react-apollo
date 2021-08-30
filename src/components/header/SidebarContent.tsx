import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Box, Button, Divider, List, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'

import NavItem from '../NavItem'
import {
  BarChart as BarChartIcon,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  AccountCircle as UserIcon,
  People as UsersIcon,
} from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAuth } from '../../features/auth/authSlice'
import { selectSetting, toggleThis } from '../../features/settings/settingsSlice'
import { DrawerHeader } from '../DashboardSidebar'
import CustomDialog from '../modals/CustomDialog'
import ChangePassword from '../account/ChangePassword'
import { logout } from '../../features/auth/authReducers'
const items = [
  {
    href: '/app/dashboard',
    icon: <BarChartIcon />,
    title: 'Dashboard',
  },
  {
    href: '/app/users',
    icon: <UsersIcon />,
    title: 'Users',
  },
  {
    href: '/app/profile',
    icon: <UserIcon />,
    title: 'Account',
  },

  {
    href: '/app/settings',
    icon: <SettingsIcon />,
    title: 'Settings',
  },
  {
    href: '',
    icon: <LockIcon />,
    title: 'Change Password',
    click: 'changePassword',
  },
  {
    href: '',
    icon: <ExitToAppIcon />,
    title: 'Logout',
    click: 'logout',
  },
]

const SidebarContent = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = React.useState(false)

  const theme = useTheme()
  const { me } = useAppSelector(selectAuth)
  const { isDrawerOpen, isMobileDrawerOpen, isMiniMode } = useAppSelector(selectSetting)
  const handleDrawerToggle = () => {
    dispatch(toggleThis({ type: 'Mobile', newValue: false }))
  }
  const handleDrawerClose = () => {
    dispatch(toggleThis({ type: 'Drawer', newValue: false }))
    dispatch(toggleThis({ type: 'Mobile', newValue: false }))
    dispatch(toggleThis({ type: 'Mini', newValue: true }))
  }
  const changePasswordHandler = () => {
    setOpen(true)
  }
  const dialogClose = () => {
    setOpen(false)
  }
  const signOut = () => {
    dispatch(logout())
  }
  const voidFunction = () => {}
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <DrawerHeader>
        {isDrawerOpen || isMobileDrawerOpen ? (
          <Box
            sx={{
              width: '100%',
              p: 1,
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Avatar
                component={RouterLink}
                alt="avatar"
                src={me ? me.avatar : ''}
                sx={{
                  cursor: 'pointer',
                  width: 64,
                  height: 64,
                }}
                to="/app/profile"
              />
              <Box sx={{ flexGrow: 1 }} />

              <IconButton style={{ color: 'white' }} onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginTop: 18,
                marginBottom: 8,
                color: 'white',
              }}
            >
              <Typography
                variant="h6"
                style={{
                  fontWeight: 500,
                }}
              >
                {me && me.name}
              </Typography>
              <Typography variant="h6">{me && me.email}</Typography>
            </div>
          </Box>
        ) : (
          <>
            {isMiniMode && (
              <Box sx={{ pt: 9, pb: 1 }}>
                <Avatar
                  component={RouterLink}
                  alt="avatar"
                  src={me ? me.avatar : ''}
                  sx={{
                    cursor: 'pointer',
                    width: 64,
                    height: 64,
                  }}
                  to="/app/profile"
                />
              </Box>
            )}
          </>
        )}
      </DrawerHeader>

      <Divider />
      <Box sx={{ px: 1, py: 0 }}>
        <List onClick={handleDrawerToggle}>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              onClick={
                !item.href
                  ? item.click === 'changePassword'
                    ? changePasswordHandler
                    : signOut
                  : voidFunction
              }
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          m: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Link color={'primary'} href={'https://pinnasofts.com/'} target={'_blank'}>
            Home
          </Link>
          <Link color={'primary'} href={'https://pinnasofts.com/about'} target={'_blank'}>
            About Us
          </Link>
          <Link color={'primary'} href={'https://pinnasofts.com/blog'} target={'_blank'}>
            Blog
          </Link>
        </Box>
        <Typography>Copyright &copy; 2021</Typography>
      </Box>
      {/* {!isMiniMode && (
        <Box
          sx={{
            backgroundColor: 'background.default',
            m: 2,
            p: 2,
          }}
        >
          <Typography align="center" gutterBottom variant="h4">
            Need more?
          </Typography>
          <Typography align="center" variant="body2" noWrap>
            Upgrade to PRO version and access 20 more screens
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 2,
            }}
          >
            <Button
              color="primary"
              component="a"
              href="https://react-material-kit.devias.io"
              variant="contained"
            >
              See PRO version
            </Button>
          </Box>
        </Box>
      )} */}

      <CustomDialog isOpen={open} handleDialogClose={dialogClose}>
        <ChangePassword />
      </CustomDialog>
    </Box>
  )
}

export default SidebarContent
