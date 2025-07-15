import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import productService from "../../services/productService";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  price: "",
  description: "",
  category: "",
  brand: "",
  stock: "",
  main_image: null,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data.products || data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
    setLoading(false);
  };

  // Fetch categories and brands
  const fetchMeta = async () => {
    try {
      setCategories(await productService.getCategories());
      setBrands(await productService.getBrands());
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
    fetchMeta();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "main_image") {
      setForm({ ...form, main_image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Open add product modal
  const openAddModal = () => {
    setForm(initialForm);
    setImagePreview(null);
    setEditMode(false);
    setEditId(null);
    setModalOpen(true);
  };

  // Open edit product modal
  const openEditModal = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      main_image: null,
    });
    setImagePreview(product.main_image);
    setEditMode(true);
    setEditId(product.id);
    setModalOpen(true);
  };

  // Handle add/edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      console.log("Form data being sent:", Object.fromEntries(formData));

      if (editMode) {
        await productService.updateProduct(editId, formData);
        toast.success("Product updated");
      } else {
        await productService.createProduct(formData);
        toast.success("Product added");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Product save error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to save product";
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Products
          </h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
            Add Product
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border rounded">
              <thead>
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-2">
                        {product.main_image ? (
                          <img
                            src={product.main_image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">${product.price}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">{product.brand}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Add/Edit Product */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setModalOpen(false)}>
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? "Edit Product" : "Add Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required>
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Brand</label>
                    <select
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      required>
                      <option value="">Select</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Main Image</label>
                  <input
                    type="file"
                    name="main_image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    disabled={loading}>
                    {editMode ? "Update" : "Add"} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProducts;
