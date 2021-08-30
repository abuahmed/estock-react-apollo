import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar } from '@material-ui/core'
import Logo from './Logo'

const MainNavbar = () => (
  <AppBar elevation={0}>
    <Toolbar sx={{ height: 64 }}>
      <RouterLink to="/">
        <Logo />
      </RouterLink>
    </Toolbar>
  </AppBar>
)

export default MainNavbar
