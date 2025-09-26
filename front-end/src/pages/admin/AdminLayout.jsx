import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const linkClass = "block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200";
  const activeLinkClass = "block px-4 py-2 rounded-md bg-blue-500 text-white";
  
  return (
    <div className="container mx-auto p-4 md:p-8 flex">
      <aside className="w-1/4 md:w-1/5 lg:w-1/6 mr-8">
        <nav className="sticky top-24">
          <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
          <ul className="space-y-2">
            <li><NavLink to="/admin" end className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Dashboard</NavLink></li>
            <li><NavLink to="/admin/products" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Produk</NavLink></li>
            <li><NavLink to="/admin/orders" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Pesanan</NavLink></li>
          </ul>
        </nav>
      </aside>
      <main className="w-3/4 md:w-4/5 lg:w-5/6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;