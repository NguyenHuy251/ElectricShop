import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ui/ProductCard';
import Pagination from '../../components/ui/Pagination';
import { categories } from '../../data/mockData';
import { getCategoryIcon } from '../../utils/categoryIcons';

const PAGE_SIZE = 8;

const ProductsPage: React.FC = () => {
  const { filteredProducts, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useProducts();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');

  // Sync category from URL params
  useEffect(() => {
    const catParam = searchParams.get('category');
    setSelectedCategory(catParam ? parseInt(catParam) : null);
  }, [searchParams, setSelectedCategory]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [searchQuery, selectedCategory, sort]);

  const sorted = [...filteredProducts].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Filters */}
        <aside style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700 }}>Danh mục</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={catBtnStyle(selectedCategory === null)}
              >
                Tất cả sản phẩm
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={catBtnStyle(selectedCategory === cat.id)}
                >
                  {getCategoryIcon(cat, { marginRight: 6 })} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {/* Toolbar */}
          <div
            style={{
              background: '#fff', borderRadius: '10px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px', gap: '12px', flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                  flex: 1, maxWidth: '300px',
                }}
              />
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {filteredProducts.length} sản phẩm
              </span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              style={{
                padding: '8px 12px', border: '1.5px solid #e5e7eb',
                borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="default">Mặc định</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Grid */}
          {paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px', color: '#9ca3af' }}><SearchOutlined /></div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p style={{ color: '#6b7280' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {paginated.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <Pagination
                page={page}
                total={sorted.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const catBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#eff6ff' : 'none',
  border: 'none',
  borderLeft: active ? '3px solid #2563eb' : '3px solid transparent',
  padding: '8px 10px',
  textAlign: 'left',
  fontSize: '13px',
  color: active ? '#2563eb' : '#374151',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  borderRadius: '0 6px 6px 0',
  transition: 'all 0.15s',
});

export default ProductsPage;
