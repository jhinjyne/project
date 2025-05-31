import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditApplicant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/applicants/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(() => alert("Failed to fetch applicant data"));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/api/applicants/get/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Applicant updated successfully");
      navigate("/");
    } catch {
      alert("Failed to update applicant");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Applicant</h2>
      <label>
        Name:
        <input name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Phone:
        <input name="phone" value={formData.phone} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Email:
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Address:
        <input name="address" value={formData.address} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Save Changes</button>
    </form>
  );
}
