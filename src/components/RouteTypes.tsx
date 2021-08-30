import React from 'react'
import { Route, RouteProps } from 'react-router'
import { useAppSelector } from '../app/hooks'
import { selectAuth } from '../features/auth/authSlice'

interface StackProps {
  //exact: RouteProps['exact'] | undefined
  path: RouteProps['path']
  element: React.ElementType
}
export const PrivateRoute = ({ element, ...rest }: StackProps) => {
  const { user } = useAppSelector(selectAuth)
  return <Route {...rest} />
  // return (
  //   <Route
  //     {...rest}
  //     children={(props) =>
  //       user ? (
  //         React.createElement(element, props)
  //       ) : (
  //         <Redirect
  //           to={{
  //             pathname: '/login',
  //             state: { from: props.location },
  //           }}
  //         />
  //       )
  //     }
  //   />
  // )
}

export const PublicRoute = ({ element, ...rest }: StackProps) => {
  const { user } = useAppSelector(selectAuth)
  return <Route {...rest} />
  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       user ? (
  //         <Redirect
  //           to={{
  //             pathname: '/app/dashboard',
  //           }}
  //         />
  //       ) : (
  //         React.createElement(component, props)
  //       )
  //     }
  //   />
  // )
}
