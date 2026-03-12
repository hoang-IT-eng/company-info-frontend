import axiosInstance from './axios';

export const getCities = async () => {
  try {
    const response = await axiosInstance.get('/api/city');
    return response.data;
  } catch (error) {
    return [
      { id: '01', name: 'Hà Nội' },
      { id: '79', name: 'Hồ Chí Minh' },
      { id: '48', name: 'Đà Nẵng' },
    ];
  }
};

export const getIndustries = async () => {
  try {
    const response = await axiosInstance.get('/api/industry');
    return response.data;
  } catch (error) {
    return [
      { id: '1', name: 'Công nghệ thông tin' },
      { id: '2', name: 'Tài chính - Ngân hàng' },
      { id: '3', name: 'Bất động sản' },
    ];
  }
};

export const searchCompanies = async (params) => {
  const response = await axiosInstance.get('/api/company/search', { params });
  return response.data;
};

export const getCompanyDetail = async (mst) => {
  const response = await axiosInstance.get(`/api/company/${mst}`);
  return response.data;
};
