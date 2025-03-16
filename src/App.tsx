import { lazy, Suspense } from "react";
import Spinner from "./components/styles/Spiner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalletLayout from "@/components/WalletLayout";
import Test from "./components/api/test";
const Home = lazy(() => import("./page/home"));
const Chat = lazy(() => import("./page/chat"));

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route element={<WalletLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/test" element={<Test />} />
              
              <Route path="/*" element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
