import axios from 'axios';

const API_URL = 'https://edu.tardigrade.land/msg/protected/channel';

export async function createSalon(salon) {
  const response = await axios.post(API_URL, salon, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ImZhbHNlIiwiaWF0IjoiMTc0NTQ5NTc2OSIsInN1YiI6ImUubGVib3VyaGlzIn0.--CQgBHM_0lXjhDr-crvRqutrQaJjflb2WrdXZ5Rcmo`
    },

  });
  return response.data;
}
