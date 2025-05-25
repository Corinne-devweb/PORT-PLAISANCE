import { authenticatedFetch } from "./auth";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4010/api";
const API_BASE = `${API_BASE_URL}/reservations`;

// Fonction pour gérer les réponses fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur serveur");
  }
  return response.json();
};

// Obtenir toutes les réservations
export const getAllReservations = async () => {
  const response = await authenticatedFetch(API_BASE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

// Créer une nouvelle réservation
export const createReservation = async (catwayNumber, reservationData) => {
  const response = await authenticatedFetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      catwayNumber,
      ...reservationData,
    }),
  });
  return handleResponse(response);
};

// Mettre à jour une réservation
export const updateReservation = async (
  catwayNumber,
  reservationId,
  updatedData
) => {
  const response = await authenticatedFetch(`${API_BASE}/${reservationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      catwayNumber,
      ...updatedData,
    }),
  });
  return handleResponse(response);
};

// Supprimer une réservation
export const deleteReservation = async (catwayNumber, reservationId) => {
  const response = await authenticatedFetch(`${API_BASE}/${reservationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

// Obtenir les réservations d’un catway spécifique
export const getReservationsByCatway = async (catwayId) => {
  const response = await authenticatedFetch(`${API_BASE}/catway/${catwayId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};
