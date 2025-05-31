import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AddApplicantForm from './pages/AddApplicantForm';
// import ApplicantsPage from './pages/ApplicantsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} /> {}
        {/* <Route path="/" element={<ApplicantsPage />} /> */}
        <Route path="/add-applicant" element={<AddApplicantForm />} />
      </Routes>
    </Router>
  );
}

export default App;