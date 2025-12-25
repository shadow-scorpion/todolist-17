import { ReactNode } from "react"
import { Navigate } from "react-router"

type Props = {
  children: ReactNode
  redirectPath: string
  isAllowed: boolean
}

export const ProtectedRoute = ({ children, isAllowed, redirectPath }: Props) => {

  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }

  return children
}
