import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const useCart = () => {
  const { user } = useContext(AuthContext);
  // console.log(user.email)
  const token = localStorage.getItem("access-token");

  const { refetch, data: cart = [] } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        return [];
      }

      const res = await fetch(
        `http://localhost:6001/carts?email=${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cart data");
      }

      return res.json();
    },
    enabled: !!user?.email,
  });

  return [cart, refetch];
};
export default useCart;
