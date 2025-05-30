import React, { useEffect, useState } from "react";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetch("/api/applicants")
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
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
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
          {applicants.map(({ id, name, phone, email, address }) => (
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
            </tr>
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
