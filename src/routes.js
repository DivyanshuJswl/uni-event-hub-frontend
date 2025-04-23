/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import MyEvents from "layouts/myevents";
import Publish from "layouts/certificatepublisher";
import ExplorePage from "layouts/explorepage";

// @mui icons
import Icon from "@mui/material/Icon";
import GoogleFormData from "layouts/getcertificate";
import DashboardOrg from "layouts/dashboardorganizer";
import ComponentTestPage from "layouts/component-testpage";
import { TipsAndUpdates } from "@mui/icons-material";

// ... (previous imports remain the same)

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "user-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/user-dashboard",
    component: <Dashboard />,
    roles: ["participant"],
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "organizer-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/organizer-dashboard",
    component: <DashboardOrg />,
    roles: ["organizer"],
  },
  // Public routes (visible to everyone)
  {
    type: "collapse",
    name: "Explore",
    key: "explore",
    icon: <Icon fontSize="small">search</Icon>,
    route: "/explore",
    component: <ExplorePage />,
    public: true,
  },

  // User routes (visible to users with role 'user')
  {
    type: "collapse",
    name: "Participated Events",
    key: "my-events",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/my-events",
    component: <MyEvents />,
    roles: ["participant"],
  },
  {
    type: "collapse",
    name: "Get Certificates",
    key: "my-certificate",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/my-certificate",
    component: <GoogleFormData />,
    roles: ["participant"],
  },
  // Organizer routes (visible to users with role 'organizer')
  {
    type: "collapse",
    name: "Create Event",
    key: "create-event",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/create-event",
    component: <Tables />,
    roles: ["organizer"],
  },

  // Common authenticated routes (visible to all logged-in users)
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    authenticated: true,
  },
  {
    type: "collapse",
    name: "Mint Certificate",
    key: "publish-certificate",
    icon: <Icon fontSize="small">publish</Icon>,
    route: "/publish-certificate",
    component: <Publish />,
    roles: ["organizer"],
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    authenticated: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    public: true,
    // hideWhenAuthenticated: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    public: true,
    // hideWhenAuthenticated: true,
  },
  {
    type: "collapse",
    name: "Demo Test Page",
    key: "test-page",
    icon: <TipsAndUpdates fontSize="small" />,
    route: "/authentication/test-page",
    component: <ComponentTestPage />,
    public: true,
  },
];

export default routes;
