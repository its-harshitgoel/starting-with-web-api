const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "") + "/api/product";

export const productService = {
    getAllProducts: async function () {
    const response = await fetch(API_BASE_URL);
    if (response.ok === false) {
      throw new Error("Could not fetch products");
    }
    const data = await response.json();
    return data;
  },

    getProductById: async function (id) {
    const response = await fetch(API_BASE_URL + "/" + id);
    if (response.ok === false) {
      throw new Error("Could not fetch product");
    }
    const data = await response.json();
    return data;
  },

  createProduct: async function (productData) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });
    if (response.ok === false) {
      throw new Error("Could not create product");
    }
    const data = await response.json();
    return data;
  },
  
  updateProduct: async function (id, productData) {
    const response = await fetch(API_BASE_URL + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });
    if (response.ok === false) {
      throw new Error("Could not update product");
    }
    const data = await response.json();
    return data;
  },

    deleteProduct: async function (id) {
    const response = await fetch(API_BASE_URL + "/" + id, {
      method: "DELETE"
    });
    if (response.ok === false) {
      throw new Error("Could not delete product");
    }
  }
};
