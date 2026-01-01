import { useState, useEffect } from 'react'

const ProductManagement = () => {
  // Sample data - in a real app, this would come from an API
  const [categories] = useState([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
  ])

  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Laptop', 
      price: 999.99, 
      category: 'Electronics', 
      stock: 50,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400']
    },
    { 
      id: 2, 
      name: 'T-Shirt', 
      price: 19.99, 
      category: 'Clothing', 
      stock: 100,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']
    },
    { 
      id: 3, 
      name: 'JavaScript Book', 
      price: 29.99, 
      category: 'Books', 
      stock: 30,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400']
    },
    { 
      id: 4, 
      name: 'Smartphone', 
      price: 699.99, 
      category: 'Electronics', 
      stock: 75,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400']
    },
    { 
      id: 5, 
      name: 'Jeans', 
      price: 49.99, 
      category: 'Clothing', 
      stock: 60,
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400']
    },
  ])

  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    images: [],
  })
  const [imageInputs, setImageInputs] = useState([''])

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Function to sort products
  const sortProducts = (productA, productB) => {
    // Step 1: Get the values we want to compare (e.g., name, price, stock)
    let valueA = productA[sortBy]
    let valueB = productB[sortBy]

    // Step 2: Handle missing values (replace null/undefined with empty string)
    if (!valueA) valueA = ''
    if (!valueB) valueB = ''

    // Step 3: For text fields, make comparison case-insensitive
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    // Step 4: Compare values based on sort order
    // For ascending: smaller values come first
    // For descending: larger values come first
    
    if (sortOrder === 'asc') {
      // Ascending: A comes before B if A is smaller
      if (valueA < valueB) return -1  // A comes first
      if (valueA > valueB) return 1     // B comes first
      return 0  // They are equal, keep original order
    } else {
      // Descending: A comes before B if A is larger
      if (valueA > valueB) return -1  // A comes first
      if (valueA < valueB) return 1   // B comes first
      return 0  // They are equal, keep original order
    }
  }

  // Filter, sort, and paginate products
  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Apply sorting using the sortProducts function
    filtered.sort(sortProducts)

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({ name: '', price: '', category: '', stock: '', images: [] })
    setImageInputs([''])
    setIsModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images || [],
    })
    // Set image inputs - if product has images, use them; otherwise start with one empty input
    const productImages = product.images && product.images.length > 0 ? product.images : []
    setImageInputs(productImages.length > 0 ? productImages : [''])
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price || !formData.category || !formData.stock) {
      alert('Please fill in all fields')
      return
    }

    // Validate price
    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price (greater than 0)')
      return
    }

    // Validate stock
    const stock = parseInt(formData.stock)
    if (isNaN(stock) || stock < 0) {
      alert('Please enter a valid stock quantity (0 or greater)')
      return
    }

    // Filter out empty image URLs
    const validImages = imageInputs.filter(url => url.trim() !== '')

    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((prod) =>
          prod.id === editingProduct.id
            ? {
                ...prod,
                name: formData.name,
                price: price,
                category: formData.category,
                stock: stock,
                images: validImages,
              }
            : prod
        )
      )
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        price: price,
        category: formData.category,
        stock: stock,
        images: validImages,
      }
      setProducts([...products, newProduct])
    }

    setIsModalOpen(false)
    setFormData({ name: '', price: '', category: '', stock: '', images: [] })
    setImageInputs([''])
    setEditingProduct(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((prod) => prod.id !== id))
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="space-y-6">
      {/* Header with Search, Filter, Sort, and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="price-asc">Sort by Price (Low-High)</option>
            <option value="price-desc">Sort by Price (High-Low)</option>
            <option value="stock-asc">Sort by Stock (Low-High)</option>
            <option value="stock-desc">Sort by Stock (High-Low)</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  ID {getSortIcon('id')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Name {getSortIcon('name')}
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Price {getSortIcon('price')}
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Category {getSortIcon('category')}
                </th>
                <th
                  onClick={() => handleSort('stock')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Stock {getSortIcon('stock')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {product.images && product.images.length > 0 ? (
                          product.images.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${product.name} ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                              }}
                            />
                          ))
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                        {product.images && product.images.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                            +{product.images.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow">
          <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>
                }
                return null
              })}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="Enter stock quantity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images (URLs)
                </label>
                <div className="space-y-2">
                  {imageInputs.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newInputs = [...imageInputs]
                          newInputs[index] = e.target.value
                          setImageInputs(newInputs)
                        }}
                        placeholder="Enter image URL"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {imageInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageInputs(imageInputs.filter((_, i) => i !== index))
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setImageInputs([...imageInputs, ''])}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    + Add Another Image
                  </button>
                </div>
                {/* Image Previews */}
                {imageInputs.some(url => url.trim() !== '') && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Previews:</p>
                    <div className="flex flex-wrap gap-2">
                      {imageInputs.map((url, index) => {
                        if (!url.trim()) return null
                        return (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3EInvalid%3C/text%3E%3C/svg%3E'
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setFormData({ name: '', price: '', category: '', stock: '', images: [] })
                  setImageInputs([''])
                  setEditingProduct(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement


