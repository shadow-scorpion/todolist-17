import { Main } from "@/app/Main"
import { PageNotFound, Faq } from "@/common/components"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"
import { ProtectedRoute } from "@/common/components/ProtectedRoute/ProtectedRoute.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  Faq: "/faq",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  return <Routes>
    <Route path={Path.Main} element={<ProtectedRoute redirectPath={Path.Login} isAllowed={isLoggedIn}><Main /></ProtectedRoute>} />
    <Route path={Path.Faq} element={<ProtectedRoute redirectPath={Path.Login} isAllowed={isLoggedIn}><Faq /></ProtectedRoute>} />
    <Route path={Path.Login} element={
      <ProtectedRoute redirectPath={Path.Main} isAllowed={!isLoggedIn}>
        <Login />
      </ProtectedRoute>}
    />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
}
