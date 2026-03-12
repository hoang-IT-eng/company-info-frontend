import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h1>
        <p className="text-gray-600 mb-6">
          {error?.message || 'Không thể tải trang này. Vui lòng thử lại sau.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
