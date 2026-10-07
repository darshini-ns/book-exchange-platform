import { useEffect, useState } from "react";
import API from "../services/api";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await API.get(`/requests/${user.id}`);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requests-page">

      <div className="requests-header">
        <span className="requests-badge">
          📋 BOOKLOOP ACTIVITY
        </span>

        <h1>My Requests</h1>

        <p>
          Track your book exchange and donation requests.
        </p>
      </div>

      {!loading && (
        <div className="request-summary">
          <div>
            <strong>{requests.length}</strong>
            <span>Total Requests</span>
          </div>

          <div>
            <strong>
              {requests.filter(
                (r) => r.status === "Pending"
              ).length}
            </strong>
            <span>Pending</span>
          </div>

          <div>
            <strong>
              {requests.filter(
                (r) => r.status === "Accepted"
              ).length}
            </strong>
            <span>Accepted</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="requests-empty">
          <div>📚</div>
          <h3>Loading requests...</h3>
          <p>Please wait while we fetch your requests.</p>
        </div>
      ) : !user ? (
        <div className="requests-empty">
          <div>🔐</div>
          <h3>Please Login</h3>
          <p>Login to view your book requests.</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="requests-empty">
          <div>📋</div>
          <h3>No Requests Yet</h3>
          <p>
            Browse books and send your first exchange
            or donation request.
          </p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div
              className="request-card"
              key={request._id}
            >
              <div className="request-book-icon">
                📖
              </div>

              <div className="request-card-content">

                <div className="request-top">
                  <span
                    className={
                      request.type === "Donation"
                        ? "request-type donation-type"
                        : "request-type exchange-type"
                    }
                  >
                    {request.type === "Donation"
                      ? "🎁 Donation"
                      : "🔄 Exchange"}
                  </span>

                  <span
                    className={
                      request.status === "Accepted"
                        ? "status accepted"
                        : request.status === "Rejected"
                        ? "status rejected"
                        : "status pending"
                    }
                  >
                    {request.status}
                  </span>
                </div>

                <h2>
                  {request.book?.title || "Book"}
                </h2>

                <p className="request-author">
                  ✍️ {request.book?.author || "Unknown Author"}
                </p>

                <div className="request-details">

                  <div>
                    <span>Category</span>
                    <strong>
                      {request.book?.category || "Other"}
                    </strong>
                  </div>

                  <div>
                    <span>Owner</span>
                    <strong>
                      {request.owner?.name || "Unknown"}
                    </strong>
                  </div>

                </div>

                <div className="request-status-message">
                  {request.status === "Pending" && (
                    <>
                      ⏳ Your request is waiting for approval.
                    </>
                  )}

                  {request.status === "Accepted" && (
                    <>
                      ✅ Your request has been accepted.
                    </>
                  )}

                  {request.status === "Rejected" && (
                    <>
                      ❌ Your request was rejected.
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requests;