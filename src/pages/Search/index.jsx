import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Building,
  MapPin,
  Briefcase,
  FileText,
  ListFilter,
} from 'lucide-react';
import { getCities, getIndustries, searchCompanies } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const q = searchParams.get('q') || '';
  const cityId = searchParams.get('cityId') || '';
  const industryId = searchParams.get('industryId') || '';
  const page = toPositiveInt(searchParams.get('page'), 1);
  const limit = toPositiveInt(searchParams.get('limit'), 10);

  const [localQ, setLocalQ] = useState(q);
  const [localCity, setLocalCity] = useState(cityId);
  const [localIndustry, setLocalIndustry] = useState(industryId);
  const [localLimit, setLocalLimit] = useState(String(limit));

  useEffect(() => {
    setLocalQ(q);
    setLocalCity(cityId);
    setLocalIndustry(industryId);
    setLocalLimit(String(limit));
  }, [q, cityId, industryId, limit]);

  const limitOptions = useMemo(() => ['10', '20', '50'], []);

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const { data: industries, isLoading: industriesLoading } = useQuery({
    queryKey: ['industries'],
    queryFn: getIndustries,
  });

  const cityOptions = Array.isArray(cities) ? cities : cities?.data || [];
  const industryOptions = Array.isArray(industries) ? industries : industries?.data || [];

  const { data: searchData, isLoading, isError } = useQuery({
    queryKey: ['search', { q, cityId, industryId, page, limit }],
    queryFn: () => searchCompanies({ q, cityId, industryId, page, limit }),
  });

  const buildParams = ({ nextQ, nextCity, nextIndustry, nextPage, nextLimit }) => {
    const params = {};

    if (nextQ) params.q = nextQ;
    if (nextCity) params.cityId = nextCity;
    if (nextIndustry) params.industryId = nextIndustry;

    params.page = nextPage.toString();
    params.limit = nextLimit.toString();

    return params;
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();

    const nextLimit = toPositiveInt(localLimit, 10);

    setSearchParams(
      buildParams({
        nextQ: localQ.trim(),
        nextCity: localCity,
        nextIndustry: localIndustry,
        nextPage: 1,
        nextLimit,
      })
    );
  };

  const companies = Array.isArray(searchData?.data) ? searchData.data : [];
  const totalItems = searchData?.total ?? searchData?.totalItems ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setSearchParams(
      buildParams({
        nextQ: q,
        nextCity: cityId,
        nextIndustry: industryId,
        nextPage: newPage,
        nextLimit: limit,
      })
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ListFilter className="w-5 h-5 mr-2 text-blue-600" />
            Bộ lọc tìm kiếm
          </h2>
          <form onSubmit={handleFilterSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ khóa</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Tên, MST..."
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố</label>
              {citiesLoading ? (
                <div className="h-10 rounded-xl bg-gray-200 animate-pulse" />
              ) : (
                <select
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {cityOptions.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
              {industriesLoading ? (
                <div className="h-10 rounded-xl bg-gray-200 animate-pulse" />
              ) : (
                <select
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={localIndustry}
                  onChange={(e) => setLocalIndustry(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {industryOptions.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số kết quả/trang</label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={localLimit}
                onChange={(e) => setLocalLimit(e.target.value)}
              >
                {limitOptions.map((item) => (
                  <option key={item} value={item}>
                    {item} kết quả
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm"
            >
              Áp dụng bộ lọc
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h1>
          <div className="text-sm text-gray-500">Tìm thấy {totalItems} doanh nghiệp</div>
        </div>

        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : isError ? (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl">
            Đã có lỗi xảy ra hoặc đang kết nối...
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-500">Vui lòng thử tìm với từ khóa hoặc bộ lọc khác.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map((company, index) => {
              const mst = company.mst || company.taxCode || company.id;
              const detailLink = mst ? `/company/${mst}` : null;

              return (
                <div
                  key={company.id || mst || index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition">
                        {company.name || 'Công ty chưa có tên'}
                      </h2>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-1 text-gray-400" />
                        Mã số thuế:
                        <span className="font-semibold text-gray-800 ml-1">{mst || 'N/A'}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="truncate">{company.address || 'Đang cập nhật địa chỉ'}</span>
                      </div>
                      {(company.industry || company.industryName) && (
                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {company.industry || company.industryName}
                        </div>
                      )}
                    </div>
                    {detailLink ? (
                      <Link
                        to={detailLink}
                        state={{ from: `${location.pathname}${location.search}` }}
                        className="shrink-0 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="shrink-0 px-4 py-2 border border-gray-300 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                        disabled
                      >
                        Xem chi tiết
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8 py-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-gray-700">
                  Trang {page} / {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
