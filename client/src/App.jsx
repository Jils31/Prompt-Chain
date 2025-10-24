import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ChainList from "./pages/ChainList";
import ChainDetail from "./pages/ChainDetail";
import NewChain from "./pages/NewChain";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login"
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element = {<Signup />} />
                    <Route
            path="/chains"
            element={
              <ProtectedRoute>
                <ChainList />
              </ProtectedRoute>
            }
          />

          <Route path="/chains/:chainId" element={<ChainDetailWrapper />} />

          <Route path="/chains/new" element={<NewChain />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

function ChainDetailWrapper() {
  const { chainId } = useParams();
  console.log("Current chainId:", chainId);
  return <ChainDetail chainId={chainId} />;
}
