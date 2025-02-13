import { useUser } from "./contexts/UserContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ContentViewer from "./pages/ContentViewer";
import PublicDashboard from "./pages/PublicDashboard";
import TagTypeCards from "./components/TagTypeCards";
import PublicCards from "./components/PublicCards";

function App() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

      {/* shared content access based on link */}
      <Route path="/shared/" element={<PublicDashboard />}>
        <Route path="brain/:link/:userId" element={<PublicCards />}></Route>
        <Route path="view/:contentId" element={<ContentViewer />}></Route>
        <Route
          path="content/:link/:contentId"
          element={<ContentViewer />}
        ></Route>
      </Route>

      {/* Dashboard Layout with Outlet */}
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<TagTypeCards />} />

        <Route path="content/:contentId" element={<ContentViewer />} />

        <Route path="tags" element={<TagTypeCards />} />
        <Route path="types/:type" element={<TagTypeCards />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
