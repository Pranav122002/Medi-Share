import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function Home() {
  const [allOrders, setAllOrders] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    orderType: "",
    medicineName: "",
    executeStatus: "",
    verifyStatus: "",
    donarName: "",
    requesterName: "",
  });

  useEffect(() => {
    fetchAllOrders();
  }, []);

  function fetchAllOrders() {
    const query = new URLSearchParams(filterOptions).toString();
    const url = `${API_BASE_URL}/all-orders${query ? `?${query}` : ""}`;

    console.log("filteroptions = ", filterOptions);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("order data = ", data);
        setAllOrders(data);
      });
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  }

  return (
    <>
      <div>
        <div className="bodyy">
          <h1>Analysis</h1>
          <div className="filter-options">
            <h2>Filter Options</h2>
            <label>
              Order Type:
              <input
                type="text"
                name="orderType"
                value={filterOptions.orderType}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Donar Name:
              <input
                type="text"
                name="donarName"
                value={filterOptions.donarName}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Requester Name:
              <input
                type="text"
                name="requesterName"
                value={filterOptions.requesterName}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              Medicine Name:
              <input
                type="text"
                name="medicineName"
                value={filterOptions.medicineName}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Execute Status:
              <input
                type="text"
                name="executeStatus"
                value={filterOptions.executeStatus}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Verify Status:
              <input
                type="text"
                name="verifyStatus"
                value={filterOptions.verifyStatus}
                onChange={handleFilterChange}
              />
            </label>
            <button onClick={fetchAllOrders}>Apply Filter</button>
          </div>
          {allOrders.map((order) => (
            <div key={order._id}>
              <p>Order ID: {order._id}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
