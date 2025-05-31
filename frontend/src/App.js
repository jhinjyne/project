import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AddApplicantForm from './pages/AddApplicantForm';
import EditApplicant from "./pages/EditApplicant";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} /> {}
        <Route path="/add-applicant" element={<AddApplicantForm />} />
        <Route path="/edit-applicant/:id" element={<EditApplicant />} />
      </Routes>
    </Router>
  );
}

export default App;