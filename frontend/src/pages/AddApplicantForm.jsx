import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddApplicantForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([{ text: '', category_id: '' }]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCommentChange = (index, field, value) => {
    const newComments = [...comments];
    newComments[index][field] = value;
    setComments(newComments);
  };

  const addCommentField = () => {
    setComments([...comments, { text: '', category_id: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/applicants', {
        ...form,
        comments,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Applicant added!');
      navigate('/');
    } catch {
      setError('Failed to add applicant');
    }
  };

    return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="card p-4 bg-light shadow"
        style={{ width: '500px' }}
      >
        <h3 className="text-center mb-4">Add Applicant</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <input
            name="name"
            className="form-control"
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control"
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="phone"
            className="form-control"
            onChange={handleChange}
            placeholder="Phone"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="address"
            className="form-control"
            onChange={handleChange}
            placeholder="Address"
            required
          />
        </div>

        <h5>Comments</h5>
        {comments.map((comment, idx) => (
          <div className="mb-3" key={idx}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Comment"
              value={comment.text}
              onChange={(e) => handleCommentChange(idx, 'text', e.target.value)}
              required
            />
            <select
              className="form-select"
              value={comment.category_id}
              onChange={(e) => handleCommentChange(idx, 'category_id', e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        ))}

        <div className="d-grid gap-2 mb-3">
          <button type="button" className="btn btn-secondary" onClick={addCommentField}>
            Add Comment
          </button>
          <button type="submit" className="btn btn-primary">
            Add Applicant
          </button>
        </div>
      </form>
    </div>
  );

};

export default AddApplicantForm;
