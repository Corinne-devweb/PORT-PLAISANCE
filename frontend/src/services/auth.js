const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4010/api";

// Stockage en mémoire
let currentUser = null;
// Initialiser authToken avec le token déjà stocké dans localStorage
let authToken = localStorage.getItem("token") || null;

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur de connexion");
    }

    const data = await response.json();

    currentUser = data.user || null;
    authToken = data.token;

    // Stocker le token dans localStorage
    localStorage.setItem("token", authToken);

    return currentUser;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

export const logout = () => {
  currentUser = null;
  authToken = null;
  // Supprimer le token du localStorage au logout
  localStorage.removeItem("token");
};

export const isAuthenticated = () => currentUser !== null && authToken !== null;

export const getUser = () => currentUser;

export const getToken = () => authToken;

export const authenticatedFetch = async (url, options = {}) => {
  if (!authToken) {
    throw new Error("Utilisateur non authentifié");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    currentUser = null;
    authToken = null;
    localStorage.removeItem("token");
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  return response;
};
