import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Order = () => {
  const { user } = useAuth();
  // console.log(user.email)
  const token = localStorage.getItem("access-token");

  const { refetch, data: orders = [] } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:6001/payments?email=${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  // console.log(orders);

  const formatDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    return createdAtDate.toLocaleDateString();
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className=" bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Track All Your <span className="text-green"> Orders!</span>
            </h2>
          </div>
        </div>
      </div>

      {/* order table */}
      {orders.length > 0 ? (
        <div>
          <div className="">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead className="bg-green text-white rounded-sm">
                  <tr>
                    <th>#</th>
                    <th>Order Date</th>
                    <th>Transition Id</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="font-medium">{order.transitionId}</td>
                      <td>
                        ${order.price}
                      </td>
                      <td>{order.status}</td>
                      <td>
                        <Link
                          to='/contact'
                          className="btn btn-sm border-none text-red bg-transparent"
                        >
                          Contact
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Order is empty. Please order something.</p>
          <Link to="/menu">
            <button className="btn bg-green text-white mt-3">
              Back to Menu
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Order;
