import { useLocation, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  FileText,
  Phone,
  Mail,
  User,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { getCompanyDetail } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const CompanyDetail = () => {
  const { mst } = useParams();
  const location = useLocation();
  const backLink = location.state?.from || '/search';

  const { data: company, isLoading, isError } = useQuery({
    queryKey: ['company', mst],
    queryFn: () => getCompanyDetail(mst),
  });

  if (isLoading) {
    return <LoadingSpinner className="py-32" />;
  }

  if (isError || !company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h2>
          <p className="mb-6">
            Doanh nghiệp với mã số thuế {mst} không tồn tại hoặc đã có lỗi xảy ra.
          </p>
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại kết quả tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  const companyName = company.name || 'Đang cập nhật tên doanh nghiệp';
  const taxCode = company.mst || company.taxCode || mst;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to={backLink} className="hover:text-blue-600 transition">Tìm kiếm</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{taxCode}</span>
        </div>
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition bg-blue-50 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại kết quả tìm kiếm
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0 hidden sm:block">
              <Building2 className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{companyName}</h1>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-400/20 border border-green-400/30 text-green-50 text-sm backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                Đang hoạt động
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin chung</h3>

            <div className="flex items-start">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Mã số thuế</p>
                <p className="font-semibold text-gray-900 text-lg">{taxCode}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="text-gray-900">{company.address || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Người đại diện pháp luật</p>
                <p className="text-gray-900">{company.representative || 'Đang cập nhật'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Liên hệ & Hoạt động</h3>

            <div className="flex items-start">
              <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Ngành nghề chính</p>
                <p className="text-gray-900">{company.industry || company.industryName || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Điện thoại</p>
                <p className="text-gray-900">{company.phone || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{company.email || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Ngày thành lập</p>
                <p className="text-gray-900">{company.issueDate || 'Đang cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Tình trạng</p>
                <p className="text-gray-900">{company.status || 'Đang cập nhật'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
