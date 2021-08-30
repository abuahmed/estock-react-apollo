import React, { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { experimentalStyled as styled, alpha } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { setSearchText } from '../../features/settings/settingsSlice'
import { useAppDispatch } from '../../app/hooks'
import InputBase, { InputBaseProps as MuiInputBaseProps } from '@material-ui/core/InputBase'

const SearchCustom = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

interface InpuBaseProps extends MuiInputBaseProps {
  open?: boolean
}

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'open',
})<InpuBaseProps>(({ theme, open }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    ...(!open && {
      [theme.breakpoints.up('xs')]: {
        width: '0',
        '&:focus': {
          width: '10ch',
        },
      },
      [theme.breakpoints.up('sm')]: {
        width: '0',
        '&:focus': {
          width: '20ch',
        },
      },
    }),
    ...(open && {
      [theme.breakpoints.up('xs')]: {
        width: '10ch',
      },
      [theme.breakpoints.up('sm')]: {
        width: '20ch',
      },
    }),
  },
}))

export default function Search({ initialValue = '', deferTime = 1000 }) {
  const [value, setValue] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const hasValue = value && value !== ''
  const isOpen = hasValue as boolean // || alwaysOpen

  const handleChange = (v: string) => {
    setValue(v)
    debounce(v)
  }

  const debounce = useCallback(
    _.debounce((_searchVal: string) => {
      dispatch(setSearchText(_searchVal))
    }, 1000),
    []
  )

  return (
    <SearchCustom>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        autoComplete="off"
        id="search-input"
        value={value}
        open={isOpen}
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        inputRef={(node) => {
          if (node && initialValue && initialValue !== '') {
            node.focus()
          }
        }}
        onChange={(e) => handleChange(e.target.value)}
      />
    </SearchCustom>
  )
}
