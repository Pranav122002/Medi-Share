import React, { useState, useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PieController,
  ArcElement,
} from "chart.js";
import { API_BASE_URL } from "../config";
import "../css/Analytics.css";

export default function Analytics() {
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allOrderMedicines, setAllOrderMedicines] = useState([]);
  const barChartRef = useRef(null);
  const barChartUserRef = useRef(null);
  const pieChartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchAllOrders();
    fetchAllMedicines();
    fetchAllUsers();
  }, []);

  function fetchAllUsers() {
    fetch(
      `${API_BASE_URL}/allusers/${JSON.parse(localStorage.getItem("user"))._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      });
  }

  function fetchAllOrders() {
    fetch(`${API_BASE_URL}/all-orders`)
      .then((response) => response.json())
      .then((data) => {
        setAllOrders(data);
      });
  }

  function fetchAllMedicines() {
    fetch(`${API_BASE_URL}/all-orders-medicines`)
      .then((response) => response.json())
      .then((data) => {
        setAllOrderMedicines(data);
      });
  }

  useEffect(() => {
    if (allOrders.length > 0) {
      createBarChart();
    }
  }, [allOrders]);

  useEffect(() => {
    if (allUsers.length > 0) {
      createUserBarChart();
    }
  }, [allUsers]);

  useEffect(() => {
    if (allOrderMedicines.length > 0) {
      createPieChart();
    }
  }, [allOrderMedicines]);

  function createUserBarChart() {
    const userRoles = allUsers.map((user) => user.role);
    const roleCounts = userRoles.reduce((counts, role) => {
      counts[role] = (counts[role] || 0) + 1;
      return counts;
    }, {});

    const chartData = {
      labels: Object.keys(roleCounts),
      datasets: [
        {
          label: "User Roles",
          data: Object.values(roleCounts),
          backgroundColor: [
            "rgba(153, 102, 255, 0.6)",
            "rgba(0, 255, 0, 0.6)",
            "rgba(0, 0, 255, 0.6)",
          ],
        },
      ],
    };

    Chart.register(CategoryScale, LinearScale, BarController, BarElement);

    if (barChartUserRef.current) {
      barChartUserRef.current.destroy();
    }

    const ctx = document.getElementById("userRoleChart").getContext("2d");
    barChartUserRef.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "User Role",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Count",
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  function createBarChart() {
    const orderTypes = allOrders.map((order) => order.order_type);
    const orderTypeCounts = orderTypes.reduce((counts, type) => {
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});

    const chartData = {
      labels: Object.keys(orderTypeCounts),
      datasets: [
        {
          label: "Order Type",
          data: Object.values(orderTypeCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    };

    Chart.register(CategoryScale, LinearScale, BarController, BarElement);

    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    const ctx = document.getElementById("orderTypeChart").getContext("2d");
    barChartRef.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Order Type",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Count",
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  function createPieChart() {
    const medicineNames = allOrderMedicines.map(
      (medicine) => medicine.medicine_name
    );
    const medicineCounts = allOrderMedicines.map((medicine) => medicine.count);

    const chartData = {
      labels: medicineNames,
      datasets: [
        {
          data: medicineCounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 0, 0, 0.6)",
            "rgba(0, 255, 0, 0.6)",
            "rgba(0, 0, 255, 0.6)",
            "rgba(255, 255, 0, 0.6)",
            "rgba(255, 0, 255, 0.6)",
            "rgba(0, 255, 255, 0.6)",
            "rgba(128, 0, 0, 0.6)",
            "rgba(0, 128, 0, 0.6)",
            "rgba(0, 0, 128, 0.6)",
            "rgba(128, 128, 0, 0.6)",
            "rgba(128, 0, 128, 0.6)",
            "rgba(0, 128, 128, 0.6)",
            "rgba(128, 128, 128, 0.6)",
            "rgba(0, 0, 0, 0.6)",
          ],
        },
      ],
    };

    Chart.register(PieController, ArcElement);

    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    const ctx = document.getElementById("medicinePieChart").getContext("2d");
    pieChartRef.current = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Medicine Chart",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    });

    setChartData(chartData); // Update chartData state
  }

  return (
    <>
      <div className="chartsmain">
        <div className="chartsbody">
          <div className="charts">
            <div className="pies">
              <div className="piechart">
                <canvas id="medicinePieChart"></canvas>
              </div>
              <div className="tablemain">
                {chartData && (
                  <div className="table" id="hbasihofsd">
                    <table>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Color</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrderMedicines.map((medicine, index) => (
                          <tr key={index}>
                            <td>{medicine.medicine_name}</td>
                            <td>
                              <span
                                className="color-box"
                                style={{
                                  backgroundColor:
                                    chartData.datasets[0].backgroundColor[
                                      index
                                    ],
                                }}
                              ></span>
                            </td>
                            <td>{medicine.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="bars">
              <div className="barchart">
                <canvas id="userRoleChart"></canvas>
              </div>

              <div className="barchart">
                <canvas id="orderTypeChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
