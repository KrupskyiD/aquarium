import axios from "axios";

const API_URL = "http://localhost:3001/api/aquarium";

export const getAquariums = async (token) => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createAquarium = async (aquariumData, token) => {
    const response = await axios.post(API_URL, aquariumData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteAquarium = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};