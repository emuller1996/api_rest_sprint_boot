"use client";

import { useState } from "react";
import { Link, Route, Routes } from "react-router";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import {
  HiChartPie,
  HiUsers,
  HiShoppingBag,
  HiClipboardList,
  HiLogout,
  HiMenu,
  HiX,
  HiTrendingUp,
  HiUserGroup,
  HiCash,
  HiHome,
} from "react-icons/hi";
import ListProductos from "../modules/productos/views/list";
import ClientePage from "../modules/clientes/views/list";
import ListFacturas from "../modules/facturas/views/list";
import CreateFacturaView from "../modules/facturas/views/create";

// Componente para el Sidebar Item
const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "text-white" : "text-orange-400 group-hover:text-orange-600"}`} />
      <span className="ml-3 font-medium">{label}</span>
    </Link>
  </li>
);

// Componentes para las páginas
const DashboardPage = () => (
  <div className="space-y-6 animate-fadeIn">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-800">Panel de Control</h2>
      <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
        Última actualización: Hoy
      </span>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: HiCash, label: "Ventas Hoy", value: "$12,450", change: "+12%", color: "orange" },
        { icon: HiUserGroup, label: "Clientes", value: "1,234", change: "+8%", color: "blue" },
        { icon: HiShoppingBag, label: "Productos", value: "456", change: "+5%", color: "green" },
        { icon: HiTrendingUp, label: "Crecimiento", value: "23.5%", change: "+2%", color: "purple" },
      ].map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
            </div>
            <div className={`bg-${item.color}-100 p-3 rounded-lg`}>
              <item.icon className={`w-6 h-6 text-${item.color}-500`} />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <span className="text-sm text-green-600 font-medium">{item.change}</span>
            <span className="text-sm text-gray-400 ml-2">vs mes anterior</span>
          </div>
        </div>
      ))}
    </div>

    {/* Gráfica de ejemplo */}
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Ventas Semanales</h3>
      <div className="h-48 flex items-end space-x-2">
        {[65, 45, 75, 55, 85, 70, 90].map((height, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg transition-all duration-500 hover:from-orange-500 hover:to-orange-600"
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-500 mt-2">D{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);




// Componente Principal
export function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/dashboard");

  const menuItems = [
    { to: "/dashboard", icon: HiHome, label: "Dashboard" },
    { to: "/productos", icon: HiShoppingBag, label: "Productos" },
    { to: "/clientes", icon: HiUsers, label: "Clientes" },
    { to: "/facturas", icon: HiClipboardList, label: "Facturas" },
  ];

  const handleItemClick = (to: string) => {
    setActiveItem(to);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">POS App</span>
              <p className="text-xs text-gray-500">Sistema de gestión</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Menú Principal
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.to}
                {...item}
                active={activeItem === item.to}
                onClick={() => handleItemClick(item.to)}
              />
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group">
            <HiLogout className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            <span className="ml-3 font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile con Drawer de Flowbite */}
        <header className="bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <span className="text-lg font-bold text-gray-800">POS App</span>
                <p className="text-xs text-gray-500">Sistema de gestión</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <HiMenu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Drawer de Flowbite para Mobile */}
        <Drawer
          open={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          position="left"
          className="md:hidden"
        >
          <DrawerHeader 
            title="Menú" 
            titleIcon={() => (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
            )}
            className="border-b border-gray-100"
          />
          <DrawerItems >
            <div className="py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Navegación
              </p>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.to}
                    {...item}
                    active={activeItem === item.to}
                    onClick={() => handleItemClick(item.to)}
                  />
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="flex items-center w-full p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group">
                  <HiLogout className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="ml-3 font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </DrawerItems >
        </Drawer>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/productos" element={<ListProductos />} />
              <Route path="/clientes" element={<ClientePage />} />
              <Route path="/facturas" element={<ListFacturas/>} />
              <Route path="/facturas/nuevo" element={<CreateFacturaView />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}