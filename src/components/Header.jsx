import { Link, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isSearchPage = location.pathname.startsWith('/search');

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
            <Building2 className="w-8 h-8" />
            <span className="font-bold text-base sm:text-xl tracking-tight text-gray-900">
              Tra cứu Doanh nghiệp
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/search"
              className={`text-sm font-medium transition ${isSearchPage ? 'text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Tìm kiếm
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
