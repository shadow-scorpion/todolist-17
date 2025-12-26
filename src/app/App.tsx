import "./App.css"
import style from "./App.module.css"
import { selectThemeMode } from "@/app/app-slice"
import { ErrorSnackbar, Header } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { fetchMeTC } from "@/features/auth/model/auth-slice.ts"
import { CircularProgress } from "@mui/material"

export const App = () => {
  const [init, setInit] = useState(false)
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchMeTC()).finally(() => {
      setInit(true)
    })
  }, [])

  const theme = getTheme(themeMode)
  if (!init) {
    console.log('loader')
    return (
      <div className={style.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={style.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
