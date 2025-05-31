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
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" required />
      <input name="email" onChange={handleChange} placeholder="Email" required />
      <input name="phone" onChange={handleChange} placeholder="Phone" required />
      <input name="address" onChange={handleChange} placeholder="Address" required />
          
      {comments.map((comment, idx) => (
        <div key={idx}>
          <input
            type="text"
            placeholder="Comment"
            value={comment.text}
            onChange={(e) => handleCommentChange(idx, 'text', e.target.value)}
            required
          />
          <select
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

      <button type="button" onClick={addCommentField}>Add Comment</button>
      <button type="submit">Add Applicant</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default AddApplicantForm;
