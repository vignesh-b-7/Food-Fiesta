import { api } from './client'

// ---- Auth ----
export const login = (name, role) => api.post('/auth/login', { name, role }).then((r) => r.data)

// ---- Restaurants (public) ----
export const getRestaurants = () => api.get('/restaurants').then((r) => r.data)
export const getRestaurant = (id) => api.get(`/restaurants/${id}`).then((r) => r.data)
export const getMenu = (id) => api.get(`/restaurants/${id}/menu`).then((r) => r.data)
export const getReviews = (id) => api.get(`/restaurants/${id}/reviews`).then((r) => r.data)
export const addReview = (id, review) => api.post(`/restaurants/${id}/reviews`, review).then((r) => r.data)

// ---- Restaurant partner ----
export const addMenuItem = (restaurantId, item) => api.post(`/restaurants/${restaurantId}/menu`, item).then((r) => r.data)
export const updateMenuItem = (restaurantId, itemId, item) =>
  api.put(`/restaurants/${restaurantId}/menu/${itemId}`, item).then((r) => r.data)
export const toggleMenuItemStock = (restaurantId, itemId) =>
  api.patch(`/restaurants/${restaurantId}/menu/${itemId}/stock`).then((r) => r.data)
export const deleteMenuItem = (restaurantId, itemId) =>
  api.delete(`/restaurants/${restaurantId}/menu/${itemId}`).then((r) => r.data)
export const getRestaurantOrders = (restaurantId) => api.get(`/restaurants/${restaurantId}/orders`).then((r) => r.data)
export const getSalesSummary = (restaurantId) => api.get(`/restaurants/${restaurantId}/sales-summary`).then((r) => r.data)

// ---- Orders ----
export const placeOrder = (payload) => api.post('/orders', payload).then((r) => r.data)
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data)
export const listOrders = (params) => api.get('/orders', { params }).then((r) => r.data)
export const updateOrderStatus = (id, status, deliveryPartnerId) =>
  api.patch(`/orders/${id}/status`, { status, deliveryPartnerId }).then((r) => r.data)

// ---- Delivery ----
export const listDeliveryPartners = () => api.get('/delivery/partners').then((r) => r.data)
export const getDeliveryPartner = (id) => api.get(`/delivery/partners/${id}`).then((r) => r.data)
export const setPartnerOnline = (id, online) => api.patch(`/delivery/partners/${id}/online`, { status: String(online) }).then((r) => r.data)
export const getAvailableOrders = () => api.get('/delivery/available-orders').then((r) => r.data)
export const acceptDeliveryOrder = (partnerId, orderId) =>
  api.post(`/delivery/partners/${partnerId}/accept/${orderId}`).then((r) => r.data)

// ---- Coupons ----
export const getActiveCoupons = () => api.get('/coupons/active').then((r) => r.data)

// ---- Admin ----
export const getAdminStats = () => api.get('/admin/stats').then((r) => r.data)
export const getAdminRestaurants = () => api.get('/admin/restaurants').then((r) => r.data)
export const setRestaurantStatus = (id, status) => api.patch(`/admin/restaurants/${id}/status`, { status }).then((r) => r.data)
export const getAdminCoupons = () => api.get('/admin/coupons').then((r) => r.data)
export const createCoupon = (payload) => api.post('/admin/coupons', payload).then((r) => r.data)
export const updateCoupon = (id, payload) => api.put(`/admin/coupons/${id}`, payload).then((r) => r.data)
export const deleteCoupon = (id) => api.delete(`/admin/coupons/${id}`).then((r) => r.data)
export const getComplaints = () => api.get('/admin/complaints').then((r) => r.data)
export const updateComplaintStatus = (id, status) => api.patch(`/admin/complaints/${id}/status`, { status }).then((r) => r.data)
