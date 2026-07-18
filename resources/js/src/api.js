const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content || '';

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrf(),
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export const api = {
  base: () => request('/base_json'),
  product: (slug) => request(`/product_json/${encodeURIComponent(slug)}`),
  category: (slug) => request(`/category_json/${encodeURIComponent(slug)}`),
  search: (q = '', category = '') => request(`/search_json?search=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ''}`),
  cart: () => request('/cart_json'),
  add: (body) => request('/cart/add', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) => request('/cart/update', { method: 'POST', body: JSON.stringify(body) }),
  remove: (body) => request('/cart/remove', { method: 'POST', body: JSON.stringify(body) }),
  clear: () => request('/cart/clear', { method: 'POST', body: '{}' }),
  coupon: (coupon) => request('/cart/use-coupon', { method: 'POST', body: JSON.stringify({ coupon }) }),
  removeCoupon: () => request('/cart/remove-coupon', { method: 'POST', body: '{}' }),
  order: (body) => request('/order/confirm', { method: 'POST', body: JSON.stringify(body) }),
  contact: (body) => request('/contact-us', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/logout', { method: 'POST', body: '{}' }),
};

export const mediaUrl = (path) => {
  if (!path) return '/images/products/product-1.png';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('/')) return path;
  return `/storage/${path}`;
};
