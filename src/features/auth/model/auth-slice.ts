import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { LoginInputs } from "@/features/auth/lib/schemas"
import { setAppStatusAC } from "@/app/app-slice.ts"
import { authApi } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants"
import { clearTodolists } from "@/features/todolists/model/todolists-slice.ts"
import { clearTasks } from "@/features/todolists/model/tasks-slice.ts"
import { clearTasksAndTodolists } from "@/common/actions/common.actions.ts"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
  reducers: (create) => ({
    fetchMeTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.fetchMe()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (e) {
          handleServerNetworkError(dispatch, e)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          console.log(state.isLoggedIn)
        },
      },
    ),
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            localStorage.setItem(AUTH_TOKEN, res.data.data.token)
            return { isLoggedIn: true }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (e) {
          handleServerNetworkError(dispatch, e)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: "succeeded" }))
            localStorage.removeItem(AUTH_TOKEN)
            dispatch(clearTasksAndTodolists())
            return { isLoggedIn: false }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (e) {
          handleServerNetworkError(dispatch, e)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        },
      },
    ),
  }),
})

export const { selectIsLoggedIn } = authSlice.selectors
export const { loginTC, logoutTC, fetchMeTC } = authSlice.actions
export const authReducer = authSlice.reducer
