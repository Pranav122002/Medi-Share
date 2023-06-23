import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Hnavbar } from "./Hnavbar";
import { API_BASE_URL } from "../config";

export default function Analytics() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterOrderType, setFilterOrderType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMedicine, setFilterMedicine] = useState("");
  const [filterVerifyStatus, setFilterVerifyStatus] = useState("");
  const [filterStars, setFilterStars] = useState("");
  const [filterDonorName, setFilterDonorName] = useState("");
  const [filterRequesterName, setFilterRequesterName] = useState("");
  const [filterVolunteerName, setFilterVolunteerName] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    allOrders,
    filterOrderType,
    filterStatus,
    filterMedicine,
    filterVerifyStatus,
    filterStars,
    filterDonorName,
    filterRequesterName,
    filterVolunteerName,
    sortBy,
    sortDirection,
  ]);

  function fetchAllOrders() {
    fetch(`${API_BASE_URL}/all-orders`)
      .then((response) => response.json())
      .then((data) => {
        console.log("order data =", data);
        setAllOrders(data);
      });
  }

  function applyFilters() {
    let filteredData = [...allOrders];

    if (filterOrderType !== "") {
      filteredData = filteredData.filter(
        (order) => order.order_type === filterOrderType
      );
    }

    if (filterStatus !== "") {
      filteredData = filteredData.filter(
        (order) => order.acceptance_status === filterStatus
      );
    }

    if (filterMedicine !== "") {
      filteredData = filteredData.filter((order) =>
        order.medicines.some((medicine) =>
          medicine.medicine_name.includes(filterMedicine)
        )
      );
    }

    if (filterVerifyStatus !== "") {
      filteredData = filteredData.filter(
        (order) => order.verify_status.toString() === filterVerifyStatus
      );
    }

    if (filterStars !== "") {
      filteredData = filteredData.filter(
        (order) =>
          order.feedback && order.feedback.stars === parseInt(filterStars)
      );
    }

    if (filterDonorName !== "") {
      filteredData = filteredData.filter(
        (order) =>
          order.donar &&
          order.donar.name &&
          order.donar.name.toLowerCase().includes(filterDonorName.toLowerCase())
      );
    }

    if (filterRequesterName !== "") {
      filteredData = filteredData.filter(
        (order) =>
          order.requester &&
          order.requester.name &&
          order.requester.name
            .toLowerCase()
            .includes(filterRequesterName.toLowerCase())
      );
    }

    if (filterVolunteerName !== "") {
      filteredData = filteredData.filter(
        (order) =>
          order.assigned_vol &&
          order.assigned_vol.name &&
          order.assigned_vol.name
            .toLowerCase()
            .includes(filterVolunteerName.toLowerCase())
      );
    }

    if (sortBy === "no_of_medicines") {
      filteredData.sort((a, b) => {
        if (sortDirection === "asc") {
          return a.no_of_medicines - b.no_of_medicines;
        } else {
          return b.no_of_medicines - a.no_of_medicines;
        }
      });
    } else if (sortBy === "feedback_stars") {
      filteredData.sort((a, b) => {
        const starsA = a.feedback && a.feedback.stars ? a.feedback.stars : 0;
        const starsB = b.feedback && b.feedback.stars ? b.feedback.stars : 0;
        if (sortDirection === "asc") {
          return starsA - starsB;
        } else {
          return starsB - starsA;
        }
      });
    }

    setFilteredOrders(filteredData);
  }

  function handleSortChange(e) {
    const selectedSortBy = e.target.value;
    setSortBy(selectedSortBy);
  }

  function handleSortDirectionChange(e) {
    const selectedSortDirection = e.target.value;
    setSortDirection(selectedSortDirection);
  }

  return (
    <>
      <div>
        <div className="bodyy">
          <h1>Analysis</h1>
          <div>
            <label htmlFor="filterOrderType">Filter by Order Type:</label>
            <select
              id="filterOrderType"
              value={filterOrderType}
              onChange={(e) => setFilterOrderType(e.target.value)}
            >
              <option value="">All</option>
              <option value="donate-order">donate-order</option>
              <option value="request-order">request-order</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus">Filter by Acceptance Status:</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterMedicine">Filter by Medicine Name:</label>
            <input
              type="text"
              id="filterMedicine"
              value={filterMedicine}
              onChange={(e) => setFilterMedicine(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterVerifyStatus">Filter by Verify Status:</label>
            <select
              id="filterVerifyStatus"
              value={filterVerifyStatus}
              onChange={(e) => setFilterVerifyStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStars">Filter by Stars:</label>
            <select
              id="filterStars"
              value={filterStars}
              onChange={(e) => setFilterStars(e.target.value)}
            >
              <option value="">All</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterDonorName">Filter by Donor Name:</label>
            <input
              type="text"
              id="filterDonorName"
              value={filterDonorName}
              onChange={(e) => setFilterDonorName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterRequesterName">
              Filter by Requester Name:
            </label>
            <input
              type="text"
              id="filterRequesterName"
              value={filterRequesterName}
              onChange={(e) => setFilterRequesterName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterVolunteerName">
              Filter by Volunteer Name:
            </label>
            <input
              type="text"
              id="filterVolunteerName"
              value={filterVolunteerName}
              onChange={(e) => setFilterVolunteerName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" value={sortBy} onChange={handleSortChange}>
              <option value="">None</option>
              <option value="no_of_medicines">No of Medicines</option>

              <option value="feedback_stars">Feedback Stars</option>
            </select>
          </div>
          <div>
            <label htmlFor="sortDirection">Sort direction:</label>
            <select
              id="sortDirection"
              value={sortDirection}
              onChange={handleSortDirectionChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {filteredOrders.map((order) => (
            <div key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Type: {order.order_type}</p>
              <p>Medicines:</p>
              <ul>
                {order.medicines.map((medicine, index) => (
                  <li key={index}>
                    <p>Name: {medicine.medicine_name}</p>
                    <p>Quantity: {medicine.quantity}</p>
                  </li>
                ))}
              </ul>
              <p>No of Medicines: {order.no_of_medicines}</p>
              <p>Location: {order.location.location}</p>
              <p>Execute Status: {`${order.execute_status}`}</p>
              <p>Verify Status: {`${order.verify_status}`}</p>
              <p>Acceptance Status: {`${order.acceptance_status}`}</p>
              <p>Donar: {order.donar?.name}</p>
              <p>Requester: {order.requester?.name}</p>
              <p>Assigned Volunteer: {order.assigned_vol?.name}</p>
              <p>Order Date: {order.order_creation_date.date}</p>
              <p>Feedback Stars: {order.feedback.stars}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
