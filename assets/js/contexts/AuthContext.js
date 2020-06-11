import React from 'react'

// juste besoin d'une forme 
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {}
})