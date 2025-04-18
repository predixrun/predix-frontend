import { lazy, Suspense } from "react";
import Spinner from "./components/styles/spiner/home/Spiner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WalletLayout from "@/components/WalletLayout";
const Home = lazy(() => import("./page/home"));
const Chat = lazy(() => import("./page/chat"));
const Leaderboard = lazy(() => import("./page/leaderboard"));

function App() {
  return (
    <Router>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route element={<WalletLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:externalId" element={<Chat />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
    </Router>
  );
}

export default App;
