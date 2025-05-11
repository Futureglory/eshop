// components/ThemeToggle.tsx

import { useEffect, useState } from "react";
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from "react-icons/fi";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
