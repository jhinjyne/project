import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditApplicant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addComment = () => {
    setComments([...comments, { id: null, comment: "", category_id: categories[0]?.id || 1 }]);
  };
  const deleteComment = async (index) => {
    const comment = comments[index];

    if (comment.id) {
      try {
        const res = await fetch(`http://localhost:8000/api/comments/${comment.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to delete comment");
      } catch {
        alert("Failed to delete comment from server");
        return;
      }
    }

    const updated = [...comments];
    updated.splice(index, 1);
    setComments(updated);
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    comments: "",
  });
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicantRes, categoryRes] = await Promise.all([
          fetch(`http://localhost:8000/api/applicants/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          fetch(`http://localhost:8000/api/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        const applicantData = await applicantRes.json();
        const categoryData = await categoryRes.json();

        setFormData({
          name: applicantData.name || "",
          phone: applicantData.phone || "",
          email: applicantData.email || "",
          address: applicantData.address || "",
        });
        setComments(applicantData.applicant_comments || []);
        setCategories(categoryData); 
      } catch {
        alert("Failed to fetch data");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCommentChange = (index, field, value) => {
    const updated = [...comments];
    updated[index][field] = value;
    setComments(updated);
  };

  const updateComment = async (comment) => {
    await fetch(`http://localhost:8000/api/comments/${comment.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        comment: comment.comment,
        category_id: comment.category_id,
      }),
    });
  };

  const createComment = async (comment) => {
    await fetch(`http://localhost:8000/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        applicant_id: id,
        comment: comment.comment,
        category_id: comment.category_id,
      }),
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      comments: comments.map((c) => ({
        id: c.id,
        text: c.comment,
        category_id: c.category_id,
      })),
    };

    delete payload.comments;

   try {
      const res = await fetch(`http://localhost:8000/api/applicants/get/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        }),
      });

      if (!res.ok) throw new Error("Applicant update failed");

      await Promise.all(
        comments.map((c) => (c.id ? updateComment(c) : createComment(c)))
      );
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
      <h3>Comments</h3>
      {comments.map((c, i) => (
        <div key={i}>
          <textarea
            value={c.comment}
            onChange={(e) => handleCommentChange(i, "comment", e.target.value)}
          />
          <select
            value={c.category_id}
            onChange={(e) => handleCommentChange(i, "category_id", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => deleteComment(i)}>Delete</button>
        </div>
      ))}
      <button type="button" onClick={addComment}>Add Comment</button>
      <br />
      <button type="submit">Save Changes</button>
    </form>
  );
}
