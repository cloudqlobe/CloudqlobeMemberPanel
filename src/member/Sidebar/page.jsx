import { useContext, useEffect, useState, useRef } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { getNavItems } from './navItems';
import DesktopItem from './DesktopItem';
import UserDropdown from "../auth/AdminMemberLogin/logout";
import axiosInstance from "../../utils/axiosinstance";
import AuthContext from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const Topbar = () => {
  const { memberDetails } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(2);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("api/customers");
        const data = response.data.customer;
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const navItems = getNavItems(memberDetails?.role);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCustomers([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    const query = searchQuery.toLowerCase();
    const results = customers.filter(customer => {
      if (customer.companyName?.toLowerCase().includes(query)) {
        return true;
      }

      if (customer.switchIps) {
        try {
          const ips = JSON.parse(customer.switchIps);
          if (Array.isArray(ips)) {
            return ips.some(ipObj =>
              ipObj.ip && ipObj.ip.toLowerCase().includes(query)
            );
          }
        } catch (e) {
          console.error("Error parsing switchIps:", e);
        }
      }
      return false;
    });

    setFilteredCustomers(results);
    setShowSearchResults(true);
    setIsSearching(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      handleSearch(); // Trigger search on each change
    } else {
      setFilteredCustomers([]);
      setShowSearchResults(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredItems = navItems.filter(item => {
    if (!Array.isArray(item?.roles)) return false;
    return item.roles.includes('all') || item.roles.includes(memberDetails?.role);
  });

  const SearchResultsDropdown = () => {
    if (!showSearchResults) return null;

    return (
      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        {isSearching ? (
          <div className="px-4 py-2 text-gray-500">Searching...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">No results found</div>
        ) : (
          filteredCustomers.map(customer => (
            <button
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors duration-200"
              onClick={() => {
                setSearchQuery(customer.companyName);
                setShowSearchResults(false);
              }}
            >
              <div className="font-medium">{customer.companyName}</div>
              {customer.switchIps && (
                <div className="text-xs text-gray-500">
                  IPs: {JSON.parse(customer.switchIps).map(ip => ip.ip).filter(ip => ip).join(', ')}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    );
  };


  const renderMobileItem = (item) => {
    if (item.href) {
      return (
        <a
          href={item.href}
          className="block px-6 py-3 text-gray-600 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </div>
        </a>
      );
    }

    return (
      <details key={item.id} className="group">
        <summary className="flex justify-between items-center px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer list-none">
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </div>
          <ChevronRightIcon className="w-5 h-5 ml-1 text-gray-500 group-open:rotate-90 transform transition" />
        </summary>
        <div className="pl-6">
          {item.subItems?.map((subItem, index) => (
            subItem.href ? (
              <a
                key={index}
                href={subItem.href}
                className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {subItem.label}
              </a>
            ) : subItem.subMenu ? (
              <details key={index} className="group">
                <summary className="flex justify-between items-center px-3 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer list-none">
                  {subItem.label}
                  <ChevronRightIcon className="w-5 h-5 ml-1 text-gray-500 group-open:rotate-90 transform transition" />
                </summary>
                <div className="pl-3">
                  {subItem.items.map((menuItem, menuIndex) => (
                    <a
                      key={menuIndex}
                      href={menuItem.href}
                      className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {menuItem.label}
                    </a>
                  ))}
                </div>
              </details>
            ) : null
          ))}
        </div>
      </details>
    );
  };

  return (
    <header className="w-full p-4 bg-white flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-gray-700 focus:outline-none"
      >
        <Bars3Icon className="w-8 h-8" />
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8 items-left"
        style={{ display: "flex", alignItems: "center" }}
      >
        {filteredItems.map(item => (
          <DesktopItem
            key={item.id}
            item={item}
            isOpen={openDropdownId === item.id}
            onToggle={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
          />
        ))}
      </nav>

      {/* Search Bar */}
      <div className="hidden md:flex items-center mx-4 flex-1" style={{ maxWidth: '600px', position: 'relative' }}>
        <div className="relative w-full mr-3" ref={searchRef}>
          <input
            type="text"
            placeholder="Search by company name or IP..."
            className="w-full py-2 px-4 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
          <MagnifyingGlassIcon
            className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={handleSearch}
          />
          <SearchResultsDropdown />
        </div>
        <button
          className="flex items-center text-white px-4 py-2 text-sm transition-all duration-300 ease-in-out
             bg-green-600 hover:bg-green-700 active:bg-green-800
             shadow-md hover:shadow-lg active:shadow-sm"
          onClick={handleSearch}
        >
          <MagnifyingGlassIcon className="w-5 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-medium tracking-wide">SEARCH</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
            <h3 className="font-medium text-lg">Menu</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <MagnifyingGlassIcon
                className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
            <div className="space-y-1">
              {filteredItems.map(item => (
                <div key={item.id} className="border-b last:border-b-0">
                  {renderMobileItem(item)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <motion.button
        className="relative p-3 bg-gray-100 rounded-xl shadow hover:bg-gray-200 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-gray-800" />
        {notifications > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {notifications}
          </motion.span>
        )}
      </motion.button>


      {/* User Dropdown */}
      <div className="relative">
        <UserDropdown />
      </div>
    </header>
  );
};

export default Topbar;