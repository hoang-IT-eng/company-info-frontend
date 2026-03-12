import axiosInstance from './axios';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
};

export const getCities = async () => {
  try {
    const response = await axiosInstance.get('/api/city');
    return normalizeList(response.data);
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
    return normalizeList(response.data);
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
  const payload = response.data;
  const list = normalizeList(payload?.data ?? payload);
  const total =
    payload?.total ??
    payload?.totalItems ??
    payload?.data?.total ??
    payload?.data?.totalItems ??
    0;

  if (Array.isArray(payload?.data)) {
    return { ...payload, data: payload.data, total: total ?? payload.total ?? 0 };
  }

  if (Array.isArray(list)) {
    return { ...payload, data: list, total };
  }

  return payload;
};

export const getCompanyDetail = async (mst) => {
  const response = await axiosInstance.get(`/api/company/${mst}`);
  return response.data?.data ?? response.data;
};
