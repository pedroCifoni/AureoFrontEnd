export const useAuth = () => {
  const token = localStorage.getItem('aureo_token');
  return {
    isAuthenticated: !!token,
    isLoading: false,
  };
};
