import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./app/Dashboard";
import Analytics from "./app/AnalyticsPage";
import Questions from "./app/QuestionsPage";
import Review from "./app/ReviewPage";
import Settings from "./app/SettingsPage";
import Header from "./app/Header";
import { Toaster } from "sonner";
import WelcomeModal from "./components/WelcomeModal";
import QuestionEditForm from "./components/questions/QuestionEditForm";

const App = () => {
  return (
    <>
      <WelcomeModal />
      <Router>
        <Toaster position="top-right" richColors />
        <div className="relative">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/edit/:id" element={<QuestionEditForm />} />
            <Route path="/review" element={<Review />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
