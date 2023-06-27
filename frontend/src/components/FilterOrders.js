import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../css/FilterOrders.css";

export default function FilterOrders() {
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
      <div className="analytic">
        <div className="bodyy">
          <h1>Data Analysis</h1>
          <h2>Filter by</h2>
          <div className="inputfilters">
            <div className="inputfiltersflex">
              <label className="inputfilterlabel" htmlFor="filterMedicine">
                Medicine Name:
              </label>
              <input
                className="inputfiltersearch"
                type="text"
                id="filterMedicine"
                value={filterMedicine}
                onChange={(e) => setFilterMedicine(e.target.value)}
              />
            </div>
            <div className="inputfiltersflex">
              <label className="inputfilterlabel" htmlFor="filterDonorName">
                Donor Name:
              </label>
              <input
                className="inputfiltersearch"
                type="text"
                id="filterDonorName"
                value={filterDonorName}
                onChange={(e) => setFilterDonorName(e.target.value)}
              />
            </div>
            <div className="inputfiltersflex">
              <label className="inputfilterlabel" htmlFor="filterRequesterName">
                Requester Name:
              </label>
              <input
                className="inputfiltersearch"
                type="text"
                id="filterRequesterName"
                value={filterRequesterName}
                onChange={(e) => setFilterRequesterName(e.target.value)}
              />
            </div>
            <div className="inputfiltersflex">
              <label className="inputfilterlabel" htmlFor="filterVolunteerName">
                Volunteer Name:
              </label>
              <input
                className="inputfiltersearch"
                type="text"
                id="filterVolunteerName"
                value={filterVolunteerName}
                onChange={(e) => setFilterVolunteerName(e.target.value)}
              />
            </div>
          </div>

          <div className="optionsearch">
            <div className="optionsearchflex">
              <label htmlFor="filterOrderType">Order Type</label>
              <br />
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
            <div className="optionsearchflex">
              <label htmlFor="filterStatus">Acceptance Status</label> <br />
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

            <div className="optionsearchflex">
              <label htmlFor="filterVerifyStatus">Verify Status:</label> <br />
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
            <div className="optionsearchflex">
              <label htmlFor="filterStars">Stars</label> <br />
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

            <div className="optionsearchflex">
              <label htmlFor="sortBy">Sort by</label> <br />
              <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                <option value="">None</option>
                <option value="no_of_medicines">No of Medicines</option>

                <option value="feedback_stars">Feedback Stars</option>
              </select>
            </div>
            <div className="optionsearchflex">
              <label htmlFor="sortDirection">Sort direction</label> <br />
              <select
                id="sortDirection"
                value={sortDirection}
                onChange={handleSortDirectionChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="analyticorder">
            {filteredOrders.map((order) => (
              <div className="analticssingleflex" key={order._id}>
                <div className="analticssingle">
                  <p className="highlight">
                    <span className="analyticspan">Order ID :</span>
                  </p>
                  <p className="highlight">{order._id}</p>
                  <p>
                    <span className="analyticspan">Order Type :</span>
                  </p>
                  <p>{order.order_type}</p>
                  {order.medicines.map((medicine) => (
                    <>
                      <p>
                        <span className="analyticspan">Medicine Name :</span>
                      </p>
                      <p>{medicine.medicine_name}</p>
                      <p>
                        <span className="analyticspan">Quantity :</span>
                      </p>
                      <p>{medicine.quantity}</p>
                    </>
                  ))}
                  <p>
                    <span className="analyticspan">No of Meds :</span>
                  </p>
                  <p>{order.no_of_medicines}</p>
                  <p>
                    <span className="analyticspan">Location :</span>
                  </p>
                  <p>{order?.location?.location}</p>
                  <p>
                    <span className="analyticspan">Execute Status :</span>
                  </p>
                  <p>{`${order.execute_status}`}</p>
                  <p>
                    <span className="analyticspan">Verify Status :</span>
                  </p>
                  <p>{`${order.verify_status}`}</p>
                  <p>
                    <span className="analyticspan">Acceptance Status :</span>
                  </p>
                  <p>{`${order.acceptance_status}`}</p>
                  <p>
                    <span className="analyticspan">Donor Name :</span>
                  </p>{" "}
                  <p>{order.donar?.name}</p>
                  <p>
                    <span className="analyticspan">Requester Name:</span>
                  </p>
                  <p>{order.requester?.name}</p>
                  <p>
                    <span className="analyticspan">Volunteer Name :</span>
                  </p>
                  <p>{order.assigned_vol?.name}</p>
                  <p>
                    <span className="analyticspan">Order Creation :</span>
                  </p>
                  <p>{order.order_creation_date?.date}</p>
                  <p>
                    <span className="analyticspan">Feedback Stars :</span>
                  </p>
                  <p>{order.feedback.stars}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
