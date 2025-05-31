import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

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
    } catch {
      alert('Failed to delete some applicants.');
    }
  };

  return (
    <div>
      <h1>Applicants</h1>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleAdd}>Add Applicant</button>
        <button onClick={handleEdit} disabled={selectedIds.length !== 1}>
          Edit Applicant
        </button>
        <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
          Delete Selected
        </button>
      </div>
      <table border="1" cellPadding="5" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.length === applicants.length && applicants.length > 0}
                onChange={selectAll}
              />
            </th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(({ id, name, phone, email, address, comments = [] }) => (
            <React.Fragment key={id}>
              <tr>
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
              </tr>
              {comments.length > 0 && (
                <tr>
                  <td></td>
                  <td colSpan="4">
                    <strong>Comments:</strong>
                    <ul>
                      {comments.map((c, idx) => (
                        <li key={idx}>
                          {c.text} {c.category?.name && `(Category: ${c.category.name})`}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
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
