import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    localStorage.setItem("dark", dark);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div className={dark ? "dark" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
