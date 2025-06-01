import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OutsideClickWrapper({ children, redirectTo = "/" }) {
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const handleClickOutside = (event) => {
      setTimeout(() => {
        const userMenu = document.querySelector("[data-user-menu]");
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target) &&
          (!userMenu || !userMenu.contains(event.target))
        ) {
          setVisible(false);
          const destination = location.state?.fromSearch ? "/search" : redirectTo;
          navigate(destination);
        }
      }, 50);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate, redirectTo, location]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${visible ? "bg-black/60 backdrop-blur-sm opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div
  ref={wrapperRef}
  className={`bg-zinc-900 p-10 rounded-2xl shadow-2xl w-[95vw] max-w-5xl transform transition-all duration-500 ease-in-out ${visible ? "scale-105 opacity-100" : "scale-95 opacity-0"}`}
>
        {children}
      </div>
    </div>
  );
}

export default OutsideClickWrapper;
