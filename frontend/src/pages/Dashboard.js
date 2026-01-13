// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Mail,
  Shield,
  Calendar,
  Activity,
  Settings,
  LogOut,
  Home,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import "../App.css"; // Optional CSS file

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLogin, setLastLogin] = useState("2 hours ago");

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/api/user-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch user details");
        }

        setUser(result.data);
        setError(null);
      } catch (err) {
        console.error("Fetch user details error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      case "moderator":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <Loader2 className="animate-spin" size={48} />
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <AlertCircle size={48} className="error-icon" />
          <h2 className="error-title">Unable to load dashboard</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <Link to="/login" className="btn-primary">
              Go to Login
            </Link>
            <Link to="/" className="btn-secondary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <UserCircle size={64} />
          <h2>User not found</h2>
          <p>The user information could not be retrieved.</p>
          <div className="empty-state-actions">
            <Link to="/" className="btn-primary">
              <Home size={20} />
              Go to Home
            </Link>
            <Link to="/login" className="btn-secondary">
              Try Login Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with Navigation */}
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="home-button">
            <Home size={24} />
            <span>Home</span>
          </Link>
        </div>
        <div className="header-right">
          <button className="settings-button">
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-header">
            <div className="avatar-container">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar" />
              ) : (
                <UserCircle size={80} className="avatar-placeholder" />
              )}
            </div>
            <div className="welcome-text">
              <h1 className="welcome-title">Welcome back, {user.name}! 👋</h1>
              <p className="welcome-subtitle">Here's your dashboard overview</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* User Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <UserCircle size={24} />
              <h2>Profile Information</h2>
            </div>
            <div className="profile-info">
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">{user.email}</p>
                </div>
              </div>
              <div className="info-item">
                <Shield size={20} />
                <div>
                  <p className="info-label">Role</p>
                  <span className={`role-badge ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} />
                <div>
                  <p className="info-label">Last Login</p>
                  <p className="info-value">{lastLogin}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <Activity size={24} />
              <h2>Activity Overview</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <CheckCircle size={32} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Completed Tasks</p>
                  <p className="stat-value">24</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Calendar size={32} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">This Month</p>
                  <p className="stat-value">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card actions-card">
            <div className="card-header">
              <Settings size={24} />
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <Link to="/profile" className="action-button">
                <UserCircle size={20} />
                <span>Edit Profile</span>
              </Link>
              <Link to="/settings" className="action-button">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
              <Link to="/" className="action-button">
                <Home size={20} />
                <span>Home Page</span>
              </Link>
              <button onClick={handleLogout} className="action-button logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;