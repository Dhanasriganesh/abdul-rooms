import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "./context/AppState";
import Layout from "./components/layout/Layout";
import Guard from "./components/Guard";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import RequestRoom from "./pages/RequestRoom";
import HowItWorks from "./pages/HowItWorks";
import ForOwners from "./pages/ForOwners";
import Refer from "./pages/Refer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AccountLayout from "./pages/account/AccountLayout";
import Overview from "./pages/account/Overview";
import Requests from "./pages/account/Requests";
import RequestDetail from "./pages/account/RequestDetail";
import Saved from "./pages/account/Saved";
import Referrals from "./pages/account/Referrals";
import Profile from "./pages/account/Profile";
import PortalLayout from "./pages/portal/PortalLayout";
import PortalHome from "./pages/portal/PortalHome";
import PortalListings from "./pages/portal/PortalListings";
import PortalListingEdit from "./pages/portal/PortalListingEdit";
import PortalInquiries from "./pages/portal/PortalInquiries";
import DeskLayout from "./pages/desk/DeskLayout";
import DeskHome from "./pages/desk/DeskHome";
import DeskRequests from "./pages/desk/DeskRequests";
import DeskRequestDetail from "./pages/desk/DeskRequestDetail";
import DeskRooms from "./pages/desk/DeskRooms";
import DeskListingEdit from "./pages/desk/DeskListingEdit";
import DeskOwners from "./pages/desk/DeskOwners";
import DeskPeople from "./pages/desk/DeskPeople";
import DeskReferrals from "./pages/desk/DeskReferrals";

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="request" element={<RequestRoom />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="for-owners" element={<ForOwners />} />
            <Route path="refer" element={<Refer />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route
              path="account"
              element={
                <Guard roles={["seeker"]}>
                  <AccountLayout />
                </Guard>
              }
            >
              <Route index element={<Overview />} />
              <Route path="requests" element={<Requests />} />
              <Route path="requests/:id" element={<RequestDetail />} />
              <Route path="saved" element={<Saved />} />
              <Route path="referrals" element={<Referrals />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route
              path="portal"
              element={
                <Guard roles={["landlord"]}>
                  <PortalLayout />
                </Guard>
              }
            >
              <Route index element={<PortalHome />} />
              <Route path="listings" element={<PortalListings />} />
              <Route path="listings/new" element={<PortalListingEdit />} />
              <Route path="listings/:id" element={<PortalListingEdit />} />
              <Route path="inquiries" element={<PortalInquiries />} />
            </Route>

            <Route
              path="desk"
              element={
                <Guard roles={["mediator"]}>
                  <DeskLayout />
                </Guard>
              }
            >
              <Route index element={<DeskHome />} />
              <Route path="requests" element={<DeskRequests />} />
              <Route path="requests/:id" element={<DeskRequestDetail />} />
              <Route path="rooms" element={<DeskRooms />} />
              <Route path="rooms/new" element={<DeskListingEdit />} />
              <Route path="rooms/:id" element={<DeskListingEdit />} />
              <Route path="owners" element={<DeskOwners />} />
              <Route path="people" element={<DeskPeople />} />
              <Route path="referrals" element={<DeskReferrals />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
