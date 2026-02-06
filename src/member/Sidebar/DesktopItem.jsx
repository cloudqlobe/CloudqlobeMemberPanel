import React, { useState, useEffect, useRef } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const DesktopItem = ({ item, isOpen, onToggle }) => {
  const [subMenuOpenIndex, setSubMenuOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  const toggleSubMenu = (index) => {
    setSubMenuOpenIndex(subMenuOpenIndex === index ? null : index);
  };

  const subItemCount = item.subItems ? item.subItems.length : 0;
  const shouldReduceHeight = subItemCount <= 6;

  // 🔽 Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false); // Close the dropdown
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  if (item.href) {
    return (
      <div key={item.id}>
        <a href={item.href}>{item.icon}</a>
      </div>
    );
  }

  return (
    <div key={item.id} ref={dropdownRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        className="flex items-center text-gray-600 hover:text-indigo-600 text-base focus:outline-none"
      >
        {item.icon}
        {item.label}
      </button>

      {isOpen && item.subItems && (
        <div
          className="absolute left-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg z-10 w-[600px] p-4"
          style={{
            width: "100vw",
            position: "fixed",
            marginTop: "28px",
            background: "#efefef",
            minHeight: shouldReduceHeight ? "auto" : "39vh"
          }}
        >
          <div style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "space-evenly"
          }}>
            <div style={{
              background: "white",
              borderRadius: "3%",
              display: "flex",
              flexDirection: "column",
              width: "25%",
              paddingLeft: "40px",
              textAlign: "justify",
              justifyContent: "center",
              border: "none",
              height: "auto"
            }}>
              <h5 style={{ fontWeight: "bold", marginBottom: '8px' }}>{item.label}</h5>
              <p style={{ fontSize: "0.9rem" }}>Description about {item.label} section</p>
            </div>

            <div
              className="grid grid-cols-3"
              style={{
                gap: "35px",
                width: "72%",
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                height: "100%",
              }}
            >
              {item.subItems.map((subItem, index) => (
                <div key={index}>
                  {subItem.href ? (
                    <a
                      href={subItem.href}
                      className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-800" style={{ fontSize: "0.9rem" }}>
                        {subItem.label}
                      </div>
                      {subItem.description && (
                        <div className="text-sm text-gray-500 mt-1">{subItem.description}</div>
                      )}
                    </a>
                  ) : subItem.subMenu ? (
                    <div className=" p-2 bg-gray-100 rounded-lg transition-colors cursor-pointer" style={{ height: "45px", width: "100%" }}>
                      <div
                        onClick={() => toggleSubMenu(index)}
                        className="flex justify-between items-center p-1"
                      >
                        <div className="font-medium text-gray-800" style={{ fontSize: "0.9rem" }}>
                          {subItem.label}
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      {subItem.description && (
                        <div className="text-sm text-gray-500 mt-1">{subItem.description}</div>
                      )}
                      {subMenuOpenIndex === index && (
                        <div
                          className="absolute grid grid-cols-3 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-20"
                          style={{
                            gap: "35px",
                            top: "100%",         // aligns it directly below the parent
                            left: "420px",           // starts from the parent’s left edge
                            minWidth: "600px",
                            width: "1085px"   // optional width
                          }}
                        >
                          {subItem.items.map((menuItem, menuIndex) => (
                            <a
                              key={menuIndex}
                              href={menuItem.href}
                              className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="font-medium text-gray-800">{menuItem.label}</div>
                              {menuItem.description && (
                                <div className="text-sm text-gray-500 mt-1">{menuItem.description}</div>
                              )}
                            </a>
                          ))}
                        </div>
                      )}

                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopItem;
