import axios from "axios";

const API_URL = "https://eatx-api-1.onrender.com/api/cart";

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export const addToCart = async (foodId, token) => {
  try {
    await axios.post(
      API_URL,
      { foodId },
      getAuthHeader(token)
    );
  } catch (error) {
    console.error('Error while adding to the cart:', error.response?.data || error.message);
  }
};

export const removeQtyFromCart = async (foodId, token) => {
  try {
    await axios.post(
      `${API_URL}/remove`,
      { foodId },
      getAuthHeader(token)
    );
  } catch (error) {
    console.error('Error while removing quantity:', error.response?.data || error.message);
  }
};

export const getCartData = async (token) => {
  try {
    const response = await axios.get(API_URL, getAuthHeader(token));
    return response.data.items || {};
  } catch (error) {
    console.error('Error while fetching the cart data:', error.response?.data || error.message);
    return {};
  }
};
