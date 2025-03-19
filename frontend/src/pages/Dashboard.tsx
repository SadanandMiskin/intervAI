import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';

// Define types for session data
interface Answer {
  question: string;
  userAnswer: string;
  rating: number;
  improvedAnswer: string;
}

interface Interview {
  _id: string;
  jd: string;
  answers: Answer[];
}

interface Session {
  _id: string;
  interviewId: Interview;
  createdAt: string;
  updatedAt: string;
}

interface SessionData {
  email: string;
  sessions: Session[];
}

export const Dashboard = () => {
  const { token, logout } = useAuth();
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: SessionData = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <Link to={'/create'}>
            <button className="btn">Create Interview</button>
          </Link>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {data?.sessions?.length ? (
        <div className="session-grid">
          {data.sessions.map((session) => (
  <div
    key={session._id || Math.random().toString(36).substr(2, 9)} // Fallback key if _id is missing
    className={`session-tile ${selectedSession === session._id ? 'active' : ''}`}
    onClick={() => setSelectedSession(selectedSession === session._id ? null : session._id)}
  >
    <h3>Session {session._id ? session._id.slice(-5) : 'Unknown'}</h3> 
              <p><strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(session.updatedAt).toLocaleString()}</p>

              {selectedSession === session._id && (
                <div className="session-details">
                  <h4>Job Description:</h4>
                  <p className="jd">{session.interviewId.jd}</p>

                  <h4>Interview Questions & Answers:</h4>
                  {session.interviewId.answers.map((answer, index) => (
                    <div key={index} className="answer-card">
                      <p><strong>Question:</strong> {answer.question}</p>
                      <p><strong>Your Answer:</strong> {answer.userAnswer}</p>
                      <p><strong>Rating:</strong> {answer.rating}/10</p>
                      <p><strong>Improved Answer:</strong> {answer.improvedAnswer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No interview sessions found.</p>
      )}

      {/* Styles */}
      <style>
        {`
          .dashboard-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;
          }
          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .dashboard-actions {
            display: flex;
            gap: 10px;
          }
          .btn {
            padding: 8px 12px;
            border: none;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border-radius: 5px;
            transition: 0.3s;
          }
          .btn:hover {
            background-color: #0056b3;
          }
          .logout {
            background-color: #ff4d4d;
          }
          .logout:hover {
            background-color: #cc0000;
          }
          .session-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }
          .session-tile {
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            background-color: #f8f9fa;
            transition: 0.3s;
          }
          .session-tile:hover {
            background-color: #e2e6ea;
          }
          .session-tile.active {
            background-color: #d1ecf1;
            border: 2px solid #0c5460;
          }
          .session-details {
            margin-top: 10px;
          }
          .jd {
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 5px;
          }
          .answer-card {
            background: #fff;
            padding: 10px;
            margin: 8px 0;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};
