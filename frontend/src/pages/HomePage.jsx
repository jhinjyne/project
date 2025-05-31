import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ApplicantsPage.css';

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');


  useEffect(() => {
    fetch("http://localhost:8000/api/applicants")
      .then((res) => res.json())
      .then((data) => setApplicants(data));
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === applicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applicants.map((a) => a.id));
    }
  };

  const handleAdd = () => {
    navigate('/add-applicant');
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      navigate(`/edit-applicant/${selectedIds[0]}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map(id =>
          fetch(`http://localhost:8000/api/applicants/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        )
      );
      setApplicants(applicants.filter(app => !selectedIds.includes(app.id)));
      setSelectedIds([]);
      setMessage('Selected applicants deleted successfully.');
      setTimeout(() => setMessage(''), 3000); 

    } catch {
      alert('Failed to delete some applicants.');
    }
  };

  return (
    <div className="table-responsive">
    {message && (
      <div className="message-success">
        {message}
      </div>
    )}
      <h1 className="text-center my-4">APPLICANTS</h1>
      <div className="d-flex justify-content-center gap-3 mb-4">
  <button className="btn btn-primary" onClick={handleAdd}>
    Add Applicant
  </button>
  <button
    className="btn btn-warning"
    onClick={handleEdit}
    disabled={selectedIds.length !== 1}
  >
    Edit Applicant
  </button>
  <button
    className="btn btn-danger"
    onClick={handleBulkDelete}
    disabled={selectedIds.length === 0}
  >
    Delete Selected
  </button>
</div>
      <table className="table table-striped table-bordered rounded">
        <thead class="table-dark">
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                checked={selectedIds.length === applicants.length && applicants.length > 0}
                onChange={selectAll}
              />
            </th>
            <th scope="col">Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Comments</th> {}
          </tr>
        </thead>
        <tbody>
          {applicants.map(({ id, name, phone, email, address, applicant_comments = [] }) => (
            <React.Fragment key={id}>
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(id)}
                    onChange={() => toggleSelect(id)}
                  />
                </td>
                <td>{name}</td>
                <td>{phone}</td>
                <td>{email}</td>
                <td>{address}</td>
                <td>
                  {applicant_comments.length > 0 ? (
                    <ul className="comments-list">
                      {applicant_comments.map((c, idx) => (
                        <li key={idx}>
                          {c.comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <em>No comments</em>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
          {applicants.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No applicants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
