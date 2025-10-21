import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import ChainList from "./pages/ChainList";
import ChainDetail from "./pages/ChainDetail";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/chains" replace />} />
        <Route path="/chains" element={<ChainList />} />

        <Route
          path="/chains/:chainId"
          element={<ChainDetailWrapper />}
        />
      </Routes>
    </Router>
  );
}

export default App;

function ChainDetailWrapper() {
  const { chainId } = useParams();
  console.log("Current chainId:", chainId);
  return <ChainDetail chainId={chainId} />;
}
