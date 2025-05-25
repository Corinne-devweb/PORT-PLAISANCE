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

// Récupérer tous les catways
export const getAllCatways = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/catways`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des catways:", error);
    throw error;
  }
};

// Récupérer un catway par son numéro
export const getCatwayById = async (catwayNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/catways/${catwayNumber}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du catway ${catwayNumber}:`,
      error
    );
    throw error;
  }
};

// Créer un nouveau catway
export const createCatway = async (catwayData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/catways`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(catwayData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Erreur lors de la création du catway:", error);
    throw error;
  }
};

// Modifier un catway existant
export const updateCatway = async (catwayNumber, catwayData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/catways/${catwayNumber}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(catwayData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la modification du catway ${catwayNumber}:`,
      error
    );
    throw error;
  }
};

// Supprimer un catway
export const deleteCatway = async (catwayNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/catways/${catwayNumber}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    // Pour DELETE, on peut avoir une réponse vide
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du catway ${catwayNumber}:`,
      error
    );
    throw error;
  }
};

// Récupérer les réservations d'un catway spécifique
export const getCatwayReservations = async (catwayNumber) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/catways/${catwayNumber}/reservations`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des réservations du catway ${catwayNumber}:`,
      error
    );
    throw error;
  }
};

// Créer une réservation pour un catway spécifique
export const createCatwayReservation = async (
  catwayNumber,
  reservationData
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/catways/${catwayNumber}/reservations`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(reservationData),
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la création de la réservation pour le catway ${catwayNumber}:`,
      error
    );
    throw error;
  }
};

// Récupérer une réservation spécifique d'un catway
export const getCatwayReservationById = async (catwayNumber, reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/catways/${catwayNumber}/reservations/${reservationId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la réservation ${reservationId}:`,
      error
    );
    throw error;
  }
};

// Modifier une réservation spécifique d'un catway
export const updateCatwayReservation = async (
  catwayNumber,
  reservationId,
  reservationData
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/catways/${catwayNumber}/reservations/${reservationId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(reservationData),
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error(
      `Erreur lors de la modification de la réservation ${reservationId}:`,
      error
    );
    throw error;
  }
};

// Supprimer une réservation spécifique d'un catway
export const deleteCatwayReservation = async (catwayNumber, reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/catways/${catwayNumber}/reservations/${reservationId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    // Pour DELETE, on peut avoir une réponse vide
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la réservation ${reservationId}:`,
      error
    );
    throw error;
  }
};
