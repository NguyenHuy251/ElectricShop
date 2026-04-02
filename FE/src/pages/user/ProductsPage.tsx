import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ui/ProductCard';
import Pagination from '../../components/ui/Pagination';
import { categories } from '../../data/mockData';
import { getCategoryIcon } from '../../utils/categoryIcons';
import '../../assets/styles/pages/user-pages.css';

const PAGE_SIZE = 8;

const ProductsPage: React.FC = () => {
  const { filteredProducts, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useProducts();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');

  useEffect(() => {
    const catParam = searchParams.get('category');
    setSelectedCategory(catParam ? parseInt(catParam, 10) : null);
  }, [searchParams, setSelectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, sort]);

  const sorted = [...filteredProducts].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="products-page">
      <div className="products-layout">
        <aside className="products-sidebar">
          <div className="products-panel">
            <h3 className="products-panel__title">Danh mục</h3>
            <div className="products-category-list">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'products-category-btn products-category-btn--active' : 'products-category-btn'}
              >
                Tất cả sản phẩm
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={selectedCategory === cat.id ? 'products-category-btn products-category-btn--active' : 'products-category-btn'}
                >
                  {getCategoryIcon(cat)} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <div className="products-toolbar__left">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="products-toolbar__input"
              />
              <span className="products-toolbar__count">{filteredProducts.length} sản phẩm</span>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'default' | 'price_asc' | 'price_desc' | 'rating')}
              className="products-toolbar__sort"
            >
              <option value="default">Mặc định</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {paginated.length === 0 ? (
            <div className="products-empty">
              <div className="products-empty__icon"><SearchOutlined /></div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p className="products-empty__desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={page} total={sorted.length} pageSize={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;