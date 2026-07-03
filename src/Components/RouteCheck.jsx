import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute({ isAllowed }) {
    return isAllowed ? <Outlet /> : <Navigate to="/#" replace />
}