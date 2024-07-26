import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

// Không có props nào được truyền vào MainLayout, vì vậy không cần định nghĩa props type
const MainLayout: React.FC = () => {
  return (
    <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
