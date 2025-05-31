import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import useSound from "use-sound";
import "../styles/ApplicantsPage.css";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [rollingName, setRollingName] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWinnerRevealed, setIsWinnerRevealed] = useState(false);

  const navigate = useNavigate();
  const [playTrumpet] = useSound("/sounds/trumpet.mp3");

  useEffect(() => {
    fetch("http://localhost:8000/api/applicants")
      .then((res) => res.json())
      .then((data) => setApplicants(data));
  }, []);

  const handleBestApplicant = () => {
    setShowModal(true);
    setIsRolling(true);
    setIsWinnerRevealed(false);

    const winner = "Chandel Jyne C. Carabio";
    const names = applicants.map((a) => a.name);
    let index = 0;

    const interval = setInterval(() => {
      setRollingName(names[index % names.length]);
      index++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setRollingName(winner);
      setIsRolling(false);
      setShowConfetti(true);
      playTrumpet();

      setIsWinnerRevealed(true);

      setTimeout(() => setShowConfetti(false), 5000);
    }, 3000);
  };

  return (
    <div className="table-responsive">
      {message && <div className="message-success">{message}</div>}

      <h1 className="text-center my-4">APPLICANTS</h1>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className="btn btn-primary" onClick={() => navigate("/add-applicant")}>
          Add Applicant
        </button>
        <button
          className="btn btn-warning"
          onClick={() => selectedIds.length === 1 && navigate(`/edit-applicant/${selectedIds[0]}`)}
          disabled={selectedIds.length !== 1}
        >
          Edit Applicant
        </button>
        <button
          className="btn btn-danger"
          onClick={async () => {
            if (selectedIds.length === 0) return;
            try {
              await Promise.all(
                selectedIds.map((id) =>
                  fetch(`http://localhost:8000/api/applicants/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  })
                )
              );
              setApplicants(applicants.filter((app) => !selectedIds.includes(app.id)));
              setSelectedIds([]);
              setMessage("Selected applicants deleted successfully.");
              setTimeout(() => setMessage(""), 3000);
            } catch {
              alert("Failed to delete some applicants.");
            }
          }}
          disabled={selectedIds.length === 0}
        >
          Delete Selected
        </button>
        <button className="btn btn-success" onClick={handleBestApplicant}>
          Best Applicant
        </button>
      </div>

      {}
      <table className="table table-striped table-bordered rounded">
        <thead className="table-dark">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.length === applicants.length && applicants.length > 0}
                onChange={() => {
                  if (selectedIds.length === applicants.length) setSelectedIds([]);
                  else setSelectedIds(applicants.map((a) => a.id));
                }}
              />
            </th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Address</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No applicants found.
              </td>
            </tr>
          ) : (
            applicants.map(({ id, name, phone, email, address, applicant_comments = [] }) => (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                      )
                    }
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
                        <li key={idx}>{c.comment}</li>
                      ))}
                    </ul>
                  ) : (
                    <em>No comments</em>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center p-4">
              <h2 className="mb-4">Best Applicant</h2>
              <div
                className="border p-3 mb-4"
                style={{
                  fontSize: "1.5rem",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                }}
              >
                {rollingName}
              </div>

              {}
              {isWinnerRevealed && (
                <button
                  className="btn btn-outline-primary mb-3"
                  onClick={() => window.open("https://drive.google.com/file/d/1Rzq_SUnVJXBOmxRyw5BHZt0BG3rJ1DEw/view?usp=sharing", "_blank")}

                >
                  Check Resume
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={isRolling}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showConfetti && <Confetti />}
    </div>
  );
}
