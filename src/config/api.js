const API_BASE_URL = window.REACT_APP_API_BASE_URL || 'http://localhost:9092';

export const API_ENDPOINTS = {
  WORKORDER_SAVE: `${API_BASE_URL}/workorder/save`,
  WORKORDER_UPDATE: (id) => `${API_BASE_URL}/workorder/update/${id}`,
  ASSET_ALL: `${API_BASE_URL}/asset/all`,
  ASSET_SAVE: `${API_BASE_URL}/asset/save`,
  ASSET_UPDATE: (id) => `${API_BASE_URL}/asset/update/${id}`,
  ASSET_DELETE: (id) => `${API_BASE_URL}/asset/delete/${id}`,
  USER_SAVE: `${API_BASE_URL}/user/save`,
  WORKORDER_USER: (userId) => `${API_BASE_URL}/workorder/user/${userId}`
};

export default API_BASE_URL;