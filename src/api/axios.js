import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let loadingToastId = null;

axiosInstance.interceptors.request.use(
  (config) => {
    loadingToastId = toast.loading('Đang tải dữ liệu...');
    return config;
  },
  (error) => {
    if (loadingToastId) toast.dismiss(loadingToastId);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (loadingToastId) toast.dismiss(loadingToastId);
    return response;
  },
  (error) => {
    if (loadingToastId) toast.dismiss(loadingToastId);

    if (error.response) {
      const { status } = error.response;
      if (status === 502 || status === 503) {
        toast.error('Hệ thống đang bảo trì hoặc gặp lỗi. Vui lòng thử lại sau.');
      } else {
        toast.error(error.response.data?.message || 'Có lỗi xảy ra!');
      }
    } else if (error.request) {
      toast.error('Không thể kết nối đến máy chủ.');
    } else {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
