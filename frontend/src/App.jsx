import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { Home } from "./Pages/Home"
import { LogIn } from "./Pages/LogIn"
import { Register } from "./Pages/Register"
import "./index.css"
import { Profile } from "./Pages/Profile"
import { Chat } from "./Components/Chat"
import { Toaster } from "react-hot-toast"
import { Error } from "./Pages/Error"
import { Dashboard } from "./adminpanel/dashboard"
import { AllUsers } from "./adminpanel/user"
import { AllGroups } from "./adminpanel/groups"
import { AllMessages} from "./adminpanel/messages"
import { AdminLogin } from "./adminpanel/adminLogin"
import { RequestPage } from "./Pages/AddUser"
import { GroupBuilderPage } from "./Pages/CreateGroups"
import { GroupPage } from "./Pages/GroupChanges"
import { NotificationPage } from "./Pages/HandleRequest"
import { ChatInfo } from "./Pages/ChatInfo"


function App() {
    const router = createBrowserRouter([
        {
            path:"/",
            element:<Home />,
        },
        {
            path:"/login",
            element:<LogIn />
        },
        {
          path:"/register",
          element:<Register />
        },
        {
          path:"/profile",
          element:<Profile />
        },
        {
          path:"/chat/:chatId",
          element:<Chat />
        },
        {
          path:"/error",
          element:<Error />
        },
        {
          path:"/admin/dashboard",
          element:<Dashboard />
        },
        {
          path:"/admin/users",
          element:<AllUsers />
        },
        {
          path:"/admin/groups",
          element:<AllGroups />
        },
        {
          path:"/admin/message",
          element:<AllMessages />
        },
        {
          path:"/admin",
          element:<AdminLogin />
        },
        {
          path:"/adduser",
          element:<RequestPage />
        },
        {
          path:"/creategroup",
          element:<GroupBuilderPage />
        },
        {
           path:"/modifygroups",
           element:<GroupPage />
        },
        {
          path:"/notification",
          element:<NotificationPage />
        },
        {
          path:"/chat/:chatId/chatInfo",
          element:<ChatInfo />
        }
    ])
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} >
          
      </RouterProvider>
    </>
  )
}
export default App
