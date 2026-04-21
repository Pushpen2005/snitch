import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children, role }) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const initialized = useSelector(state => state.auth.initialized)

    if (loading || !initialized) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (role && user.role !== role) {
        return <Navigate to={user.role === 'seller' ? '/seller/products' : '/'} replace />
    }

    return children

}

export default Protected