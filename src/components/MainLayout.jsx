import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Tra cứu Doanh nghiệp. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
