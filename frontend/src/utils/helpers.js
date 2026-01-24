export const getProductImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/300x300/ff69b4/ffffff/png?text=No+Image';
  
  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api$/, ''); // strip /api if present
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};