import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Briefcase, List } from 'lucide-react';
import { getCities, getIndustries } from '../../api';

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [cityId, setCityId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [limit, setLimit] = useState('10');

  const { data: cities, isLoading: citiesLoading, isError: citiesError } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const { data: industries, isLoading: industriesLoading, isError: industriesError } = useQuery({
    queryKey: ['industries'],
    queryFn: getIndustries,
  });

  const cityOptions = Array.isArray(cities) ? cities : cities?.data || [];
  const industryOptions = Array.isArray(industries) ? industries : industries?.data || [];

  const limitOptions = useMemo(() => ['10', '20', '50'], []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (keyword.trim()) params.set('q', keyword.trim());
    if (cityId) params.set('cityId', cityId);
    if (industryId) params.set('industryId', industryId);

    params.set('page', '1');
    params.set('limit', limit || '10');

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <section className="bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tra cứu Doanh nghiệp
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm nhanh thông tin doanh nghiệp theo tên, mã số thuế, tỉnh thành và ngành nghề.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col items-stretch gap-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Nhập tên doanh nghiệp hoặc mã số thuế"
                  className="w-full text-base sm:text-lg px-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> Tỉnh/Thành phố
                    </span>
                  </label>
                  {citiesLoading ? (
                    <div className="h-11 rounded-xl bg-gray-200 animate-pulse" />
                  ) : (
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="">Tất cả</option>
                      {cityOptions.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {citiesError && <p className="mt-2 text-xs text-red-500">Không tải được danh sách tỉnh/thành.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" /> Ngành nghề
                    </span>
                  </label>
                  {industriesLoading ? (
                    <div className="h-11 rounded-xl bg-gray-200 animate-pulse" />
                  ) : (
                    <select
                      value={industryId}
                      onChange={(e) => setIndustryId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="">Tất cả</option>
                      {industryOptions.map((industry) => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {industriesError && <p className="mt-2 text-xs text-red-500">Không tải được danh sách ngành nghề.</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <List className="w-4 h-4 text-blue-600" /> Số kết quả/trang
                    </span>
                  </label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    {limitOptions.map((item) => (
                      <option key={item} value={item}>
                        {item} kết quả
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto self-center px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
