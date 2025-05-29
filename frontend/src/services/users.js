const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4010/api";

// Fonction pour gérer les réponses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
  }
  return response.json();
};

// Fonction pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Fonction pour se connecter (login)
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
  }

  return response.json();
};

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
};

// Récupérer un utilisateur par son email (à adapter selon besoin côté backend)
export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur ${email}:`,
      error
    );
    throw error;
  }
};

// Créer un nouvel utilisateur
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
};

// Modifier un utilisateur existant (par ID Mongo)
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la modification de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

// Supprimer un utilisateur (par ID Mongo)
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const text = await response.text();

    try {
      return text ? JSON.parse(text) : { success: true };
    } catch {
      return { success: true };
    }
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
};

// Valider les données utilisateur
export const validateUserData = (userData) => {
  const errors = {};

  if (!userData.username || userData.username.trim().length < 3) {
    errors.username =
      "Le nom d'utilisateur doit contenir au moins 3 caractères";
  }

  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = "Format d'email invalide";
  }

  if (userData.password && userData.password.length < 6) {
    errors.password = "Le mot de passe doit contenir au moins 6 caractères";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
