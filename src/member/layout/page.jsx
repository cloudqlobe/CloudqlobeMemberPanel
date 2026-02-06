import Topbar from '../Sidebar/page';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar />
      </div>
      
      {/* Main Content */}
      <div className="pt-16 md:pt-20 min-h-screen">
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
