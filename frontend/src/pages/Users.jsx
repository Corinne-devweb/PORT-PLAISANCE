import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users";
import UserForm from "../components/UserForm";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError("");
    } catch (error) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSave = async (userData) => {
    try {
      setError("");
      setSuccess("");

      if (editingUser) {
        await updateUser(editingUser.email, userData);
        setSuccess("Utilisateur modifié avec succès");
      } else {
        await createUser(userData);
        setSuccess("Utilisateur créé avec succès");
      }

      setShowForm(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      setError(error.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (email) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        setError("");
        await deleteUser(email);
        setSuccess("Utilisateur supprimé avec succès");
        await loadUsers();
      } catch (error) {
        setError(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseigné";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return <div className="loading">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="container">
      <h1>Gestion des Utilisateurs</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm ? (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Utilisateurs</h2>
            <button onClick={handleCreate} className="btn btn-success">
              Nouvel Utilisateur
            </button>
          </div>

          {users.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#666" }}
            >
              Aucun utilisateur trouvé
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Email</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-warning btn-small"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(user.email)}
                          className="btn btn-danger btn-small"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
