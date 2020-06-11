import React, { useContext } from 'react'
import { Route, Redirect } from "react-router-dom"
import AuthContext from '../contexts/AuthContext'

const PrivateRoute = (props) => {
    const {isAuthenticated} = useContext(AuthContext)
    return isAuthenticated ? ( 
        <Route path={props.path} component={props.component} />
     ) : (
         <Redirect to="/login" />
     )
}
 
export default PrivateRoute;