import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./app/Dashboard";
import Analytics from "./app/AnalyticsPage";
import Questions from "./app/QuestionsPage";
import Review from "./app/ReviewPage";
import Settings from "./app/SettingsPage";
import Header from "./app/Header";
import { Toaster } from "sonner";
import WelcomeModal from "./components/WelcomeModal";

const App = () => {
  return (
    <>
      <WelcomeModal />
      <Router>
        <Toaster />
        <div className="relative">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/review" element={<Review />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
