import axios from 'axios'

const BASE_URL = 'https://edu.tardigrade.land/msg/'

export async function getSalons(token) {
  try {
    const response = await axios.get(BASE_URL + "protected/user/channels", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des salons :', error)
    throw error
  }
}

export const addMemberToSalon = async (salonId, userIdentifier, token) => {
  const response = await fetch(`${BASE_URL}protected/channel/${salonId}/user/${userIdentifier}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userIdentifier }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Erreur lors de l’ajout du membre')
  }
}

export async function createSalon(salon, token) {
  try {
    const response = await axios.post(BASE_URL + "protected/channel", salon, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création du salon :', error);
    throw error;
  }
}

export async function banUserFromChannel(channelId, userId, token) {
  const res = await fetch(`${BASE_URL}protected/channel/${channelId}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.message || 'Erreur lors du bannissement')
  }

  return true
}
