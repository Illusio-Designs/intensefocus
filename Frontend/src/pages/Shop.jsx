import React, { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import SortBy from '../components/common/SortBy';
import Pagination from '../components/common/Pagination';
import '../styles/pages/Shop.css';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Classic Aviator Sunglasses',
      category: 'sunglasses',
      price: 129.99,
      image: '/placeholder-product-1.jpg',
      brand: 'Ray-Ban',
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: 'Modern Round Eyeglasses',
      category: 'eyeglasses',
      price: 89.99,
      image: '/placeholder-product-2.jpg',
      brand: 'Oakley',
      rating: 4.3,
      reviews: 95
    },
    {
      id: 3,
      name: 'Sport Contact Lenses',
      category: 'contacts',
      price: 49.99,
      image: '/placeholder-product-3.jpg',
      brand: 'Acuvue',
      rating: 4.7,
      reviews: 203
    },
    // Add more products as needed
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'eyeglasses', label: 'Eyeglasses' },
    { value: 'contacts', label: 'Contact Lenses' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price', label: 'Price Low to High' },
    { value: 'price-desc', label: 'Price High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="shop-page">
      <div className="container">
        {/* Page Header */}
        <div className="shop-header">
          <h1 className="page-title">Shop</h1>
          <p className="page-subtitle">Discover our premium collection of eyewear</p>
        </div>

        {/* Filters and Search */}
        <div className="shop-filters">
          <div className="filters-left">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search products..."
              className="shop-search"
            />
          </div>
          <div className="filters-right">
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <SortBy 
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              className="shop-sort"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          {currentProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {currentProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay">
                        <button className="btn btn-primary btn-small">Quick View</button>
                        <button className="btn btn-secondary btn-small">Add to Cart</button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-brand">{product.brand}</p>
                      <div className="product-rating">
                        <span className="stars">★★★★☆</span>
                        <span className="rating-text">({product.reviews})</span>
                      </div>
                      <div className="product-price">
                        <span className="price">${product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                totalItems={filteredProducts.length}
                showItemsPerPage={true}
              />
            </>
          ) : (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop; 