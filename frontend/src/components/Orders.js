import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Hnavbar from "./Hnavbar";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Orders.css";
import Modal from "react-modal";
import ViewMedModal from "./ViewMedModal";
import { API_BASE_URL } from "../config";
import Select from "react-select";

export default function Orders() {
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const navigate = useNavigate();
  const [order_id, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pickupModalIsOpen, setPickupModalIsOpen] = useState(false);
  const [selectVolunteer, setSelectVolunteer] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState(new Date());
  const [selectOrder, setSelectOrder] = useState(null);
  const [viewMedModalIsOpen, setViewMedModalIsOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalOrderCount, setTotolOrderCount] = useState(0);
  const [filteredOrderCount, setFilteredOrderCount] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [filterOrderType, setFilterOrderType] = useState("");
  const [search, setSearch] = useState("");
  const filterOptions = [
    { value: "Assigned", label: "Assigned" },
    { value: "Unassigned", label: "Unassigned" },
    { value: "Executed", label: "Executed" },
    { value: "Verified", label: "Verified" },
  ];
  const defaultFilterOption = filterOption[1];

  const handleFilterChange = (selectedOption) => {
    setFilterOption(selectedOption);
    fetchOrders();
  };
  useEffect(() => {
    applyFilters();
  }, [
    orders,
    filterStatus,
    filterOrderType

  ]);

  function applyFilters() {
    let filteredData = [...orders];



    if (filterStatus !== "") {
      filteredData = filteredData.filter(

        (order) => order.verify_status.toString() === filterStatus

      );
    }






    setFilteredOrders(filteredData);
  }

  const onClickAssign = (orderID) => {
    setOrderId(orderID);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setPickupModalIsOpen(false);
  };

  const closeViewMedModal = () => {
    setViewMedModalIsOpen((preState) => !preState);
    setSelectOrder(null);
  };

  const handleVolunteer = ({ volunteer }) => {
    setSelectVolunteer(volunteer);
    setPickupModalIsOpen(true);
  };

  const handlePickupDeadline = (e) => {
    setPickupDeadline(e.target.value);
  };
  //----------Selecting voluteers for an order--------

  const viewMedicine = (currentCard) => {
    setSelectOrder(currentCard);
    setViewMedModalIsOpen((preState) => !preState);
  };

  //----------select order and view in detail--------
  useEffect(() => {
    // fetchUser();
  });

  useEffect(() => {
    fetchOrders();
    fetchVol();
  }, []);

  function fetchOrders() {
    fetch(`${API_BASE_URL}/all-remaining-orders`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      });
  }

  function fetchOrders() {
    try {
      fetch(
        `${API_BASE_URL}/allorders?page=${pageNumber}&filterOption=${filterOption.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTotolOrderCount(data.totalOrders);
          setFilteredOrderCount(data.totalFilteredOrders);
          setOrders(data.orders);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }
  const putDonateData = (order_id) => {
    fetch(`${API_BASE_URL}/order/${order_id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const execute_status = result.execute_status;
        const verify_status = result.verify_status;

        fetch(
          `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id
          }`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            const donar_id = result._id;

            fetch(`${API_BASE_URL}/donate/${order_id}`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                execute_status: execute_status,
                verify_status: verify_status,
                donar_id: donar_id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  notifyA("Failed to donate order.");
                } else {
                  if (
                    data ===
                    "Order Donated successfully and Volunteer will verify now."
                  ) {
                    navigate("/profile");
                    notifyB(data);
                  } else {
                    notifyA(data);
                  }
                }
              });
          });
      });
  };

  const putRequestData = (order_id) => {
    fetch(`${API_BASE_URL}/order/${order_id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const execute_status = result.execute_status;
        const verify_status = result.verify_status;

        fetch(
          `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id
          }`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        )
          .then((res) => res.json())
          .then((result) => {
            const requester_id = result._id;

            fetch(`${API_BASE_URL}/request/${order_id}`, {
              method: "put",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                execute_status: execute_status,
                verify_status: verify_status,
                requester_id: requester_id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  notifyA("Failed to request order.");
                } else {
                  if (data === "Order is already executed.") {
                    notifyA(data);
                  } else if (data === "Medicine is expired.") {
                    notifyA(data);
                  } else if (
                    data === "Order is not verfied by Volunteer yet."
                  ) {
                    notifyA(data);
                  } else if (data === "Order Requested successfully.") {
                    navigate("/profile");
                    notifyB(data);
                  }
                }
              });
          });
      });
  };

  const fetchVol = () => {
    fetch(`${API_BASE_URL}/all-volunteers`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setVolunteers(res);
      })
      .catch((error) => {
        notifyA("Error fetching volunteers");
      });
  };

  const AssignVol = () => {
    fetch(`${API_BASE_URL}/assign-order/${order_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assigned_vol: selectVolunteer._id,
        pickup_deadline: pickupDeadline,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.msg);
          setOrders((preOrders) => {
            return preOrders.map((item) =>
              item._id === order_id
                ? {
                  ...item,
                  assigned_vol: {
                    ...item.assigned_vol,
                    name: data.data.assigned_vol.name,
                  },
                  pickup_deadline: pickupDeadline,
                }
                : item
            );
          });
        }
      });
  };

  const renderCard = (card, index) => {
    return (
      <>
        {card.order_type == "donate-order" ? (

          <>

            <Card className="Card" key={index}>
              <Card.Body className="Card_body">
                <p>
                  <span className="medsidspan">Order Id :</span>
                  {card._id.toString().slice(-4)}
                </p>

                <p>
                  <span className="medsidspan">Order Type :</span>
                  {card.order_type}
                  <br />
                </p>
                <p>
                  <span className="medsidspan">No of Meds :</span>
                  {card.no_of_medicines}
                  <br />
                </p>
                <p>
                  <span className="medsidspan" id="locatasacas">
                    Location :
                  </span>
                  <span className="medishaelong">{card?.location?.location}</span>
                  <br />
                </p>
                <p>
                  <span className="medsidspan">Donor name :</span>
                  {card.donar.name}
                  <br />
                </p>

                <p className="notp">
                  <span className="medsidspan">Assigned to :</span>
                  {card.assigned_vol ? (
                    card.assigned_vol.name
                  ) : (
                    <Button
                      className="button-53"
                      onClick={() => onClickAssign(card._id)}
                    >
                      Assign
                    </Button>
                  )}
                </p>
                {card.is_order_rejected === false ? (<>
                  {card.verify_status === true ? (
                    <p>
                      <span className="medsidspan">Order Status :</span>Verified
                    </p>
                  ) : (
                    <p>
                      <span className="medsidspan">Order Status :</span>verification pending
                    </p>
                  )}

                </>) : (<> <p>
                      <span className="medsidspan">Order Status :</span>Medicines Discarded
                    </p></>)}

                <p className="notp">
                  <span className="medsidspan">Details :</span>
                  <Button
                    className="button-53"
                    onClick={() => viewMedicine(card)}
                  >
                    Details
                  </Button>
                </p>

                <ViewMedModal
                  viewMedModalIsOpen={viewMedModalIsOpen}
                  selectOrder={selectOrder}
                  closeViewMedModal={closeViewMedModal}
                />

                <Modal
                  className="Modal__container"
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                >
                  <h2>Volunteers</h2>
                  <ul>
                    {volunteers.map((volunteer) => {
                      return (
                        <li
                          key={volunteer._id}
                          onClick={() => {
                            handleVolunteer({ volunteer });
                          }}
                        >
                          {" "}
                          {volunteer.name}{" "}
                        </li>
                      );
                    })}
                  </ul>
                  <button onClick={closeModal}>Close Modal</button>
                </Modal>
                <Modal
                  className="Modal__container"
                  isOpen={pickupModalIsOpen}
                  onRequestClose={closeModal}
                >
                  <h2>Deadline</h2>
                  <input required type="Date" onChange={handlePickupDeadline} />
                  <br />
                  <button onClick={closeModal}>Close</button>
                  <button onClick={AssignVol}>Assign</button>
                </Modal>
              </Card.Body>
            </Card>
            <hr id="sacjgnasd" />
          </>
        ) : (
          <div id="OCard">
            <Card className="Card" key={index}>
              <Card.Body className="Card_body">
                <p>
                  <span className="medsidspan">Order Id :</span>
                  {card._id.toString().slice(-4)}
                </p>

                <p>
                  <span className="medsidspan">Order Type :</span>
                  {card.order_type}
                  <br />
                </p>
                <p>
                  <span className="medsidspan">No of Meds :</span>
                  {card.no_of_medicines}
                  <br />
                </p>
                <p>
                  <span className="medsidspan" id="locatasacas">
                    Location :
                  </span>
                  <span className="medishaelong">{card?.location?.location}</span>
                  <br />
                </p>
                <p>
                  <span className="medsidspan">Requester :</span>
                  {card.requester.name}
                  <br />
                </p>

                <p>
                  <span className="medsidspan">Assigned to :</span>
                  {card.assigned_vol ? (
                    card.assigned_vol.name
                  ) : (
                    <Button
                      className="button-53"
                      onClick={() => onClickAssign(card._id)}
                    >
                      Assign
                    </Button>
                  )}
                </p>

                {card.execute_status === true ? (

                  <p>
                    <span className="medsidspan">Order Status :</span>Order Delivered
                  </p>
                ) : (
                  <p>
                    <span className="medsidspan">Order Status :</span>Order not Delivered
                  </p>
                )}




                {/* <Button className="button-53" onClick={() => putRequestData(card._id)}>Request</Button> */}

                <p>
                  <span className="medsidspan">Details :</span>
                  <Button
                    className="button-53"
                    onClick={() => viewMedicine(card)}
                  >
                    Details
                  </Button>
                </p>

                <ViewMedModal
                  viewMedModalIsOpen={viewMedModalIsOpen}
                  selectOrder={selectOrder}
                  closeViewMedModal={closeViewMedModal}
                />

                <Modal
                  className="Modal__container"
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                >
                  <h2>Volunteers</h2>
                  <ul>
                    {volunteers.map((volunteer) => {
                      return (
                        <li
                          key={volunteer._id}
                          onClick={() => {
                            handleVolunteer({ volunteer });
                          }}
                        >
                          {volunteer.name}
                        </li>
                      );
                    })}
                  </ul>
                  <button onClick={closeModal}>Close Modal</button>
                </Modal>
                <Modal
                  className="Modal__container"
                  isOpen={pickupModalIsOpen}
                  onRequestClose={closeModal}
                >
                  <h2>Deadline</h2>
                  <input required type="Date" onChange={handlePickupDeadline} />
                  <br />
                  <button onClick={closeModal}>Close</button>
                  <button onClick={AssignVol}>Assign</button>
                </Modal>
              </Card.Body>
            </Card>
            <hr id="sacjgnasd" />
          </div>
        )}
      </>
    );
  };
  return (
    <div className="orderbody">
      <div className="bodyy">
        <div className="orderspage">
          {isLoading ? (
            <div className="loadingcont">
              <h1 className="loada">Loading...</h1>
            </div>
          ) : (
            <>
              <h1>Pending Orders</h1>
              <div className="filterOptions">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-filter"
                  type="text"
                  placeholder="search"
                />

                <select
                  id="filterStatus"
                  value={filterStatus}
                  defaultValue={""}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="false">Pending</option>
                  <option value="true">Verified/Collected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="allCards">
                <div className="OCards">
                  <div className="headd">
                    <div className="heading">
                      <p className="headp">Order ID</p>
                      <p className="headp">Order Type</p>
                      <p className="headp">No of Meds</p>
                      <p className="headp">Location</p>
                      <p className="headp">User</p>
                      <p className="headp">Volunteer</p>
                      <p className="headp">Status</p>
                      <p className="headp" id="action">
                        INFO
                      </p>
                    </div>
                  </div>
                  <hr id="mainhe" />

                  {filteredOrders
                    .filter((filteredOrders) => {
                      return search === ""
                        ? filteredOrders
                        : filteredOrders._id.includes(search);
                    }).map(renderCard)}
                </div>
              </div>
            </>
          )}

          {/* <ul>
        {orders.map((orders) => (
          <li key={orders.medicine_name}>
            <p>medicine_name : </p> {orders.medicine_name}
            <br /> <p>expiry_date : </p> {orders.expiry_date}
            <br /> <p>quantity : </p> {orders.quantity}
            <br /> <p>location : </p> {orders.location}
            <br /> <p>donar : </p> {orders.donar.name}
            <br />{" "}
            <button onClick={() => putRequestData(orders._id)}>Request</button>
          </li>
        ))}
      </ul> */}
        </div>
      </div>
    </div>
  );
}
