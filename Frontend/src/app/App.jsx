import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setInitialized } from '../features/auth/state/auth.slice.js'
function App() {


  const { handleGetMe } = useAuth()
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)


  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        await handleGetMe()
      } catch {
        // Not logged in is a valid state on app boot.
      } finally {
        dispatch(setInitialized(true))
      }
    }

    bootstrapAuth()
  }, [])

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}


export default App