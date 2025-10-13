import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const initialState = { header: [], footer: [], sidebar: [] };

export default function useMenus() {
  const [menus, setMenus] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/menus");
        if (response.data?.status === "success" && active) {
          const data = response.data.data || {};
          setMenus((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        if (active) {
          setError(err);
          setMenus(initialState);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMenus();

    return () => {
      active = false;
    };
  }, []);

  return { menus, loading, error };
}
