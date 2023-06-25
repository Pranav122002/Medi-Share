import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Volunteer.css";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { Hnavbar } from "./Hnavbar";
import ViewMedModal from "./ViewMedModal";
import { API_BASE_URL } from "../config";
import Modal from "react-modal";
import "../css/Modal.css";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpInput from "react-otp-input";

export default function Volunteer() {
  const [unverifiedorders, setUnverifiedOrders] = useState([]);
  const [isVolunteer, setIsVolunteer] = useState("");
  const [VolunteerId, setVolunteerID] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMedModalIsOpen, setViewMedModalIsOpen] = useState(false);
  const [selectOrder, setSelectOrder] = useState(null);
  const [deliverModalIsOpen, setDeliverModal] = useState(false);
  const [OTPstatus, setOTPstatus] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [OTP, setOTP] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState([...unverifiedorders]);

  const navigate = useNavigate();
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const sorted = [...unverifiedorders].sort(
      (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)
    );
    setSortedData(sorted);
  }, [unverifiedorders]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (isVolunteer) {
      fetchUnverifiedOrders();
    }
  }, [isVolunteer]);

  const viewMedicine = (currentCard) => {
    setSelectOrder(currentCard);
    setViewMedModalIsOpen((preState) => !preState);
  };
  const closeViewMedModal = () => {
    setSelectOrder(null);
    setViewMedModalIsOpen((preState) => !preState);
  };
  function fetchUser() {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.role === "volunteer") {
          setIsVolunteer(true);
          setVolunteerID(res._id);
        } else {
          setIsVolunteer(false);
        }
        setIsLoading(false);
      });
  }

  function fetchUnverifiedOrders() {
    fetch(`${API_BASE_URL}/unverifiedorders/${VolunteerId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUnverifiedOrders(data);
      });
  }

  const delivery_order = (order_id) => {
    fetch(`${API_BASE_URL}/delivery-executed/${order_id}`, {
      method: "put",
    }).then((res) => {});
  };

  const verify_donate_order = (order_id) => {
    fetch(`${API_BASE_URL}/verify-donate-order/${order_id}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => {
      res.json();
      setUnverifiedOrders((prevOrders) => {
        return prevOrders.map((item) =>
          item._id === order_id ? { ...item, verify_status: true } : item
        );
      });
      // window.location.reload();
      // setTimeout(function() {
      notifyB("Donate order verified successfully.");
      // }, 2000);
    });
  };

  const verify_request_order = async (order_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/req-order/${order_id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const order_data = await response.json();
      if (order_data.isDonarFieldBlank === false) {
        fetch(`${API_BASE_URL}/verify-request-order/${order_id}`, {
          method: "put",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }).then((res) => {
          res.json();
          window.location.reload();

          notifyB("Order verified successfully and now will be donated.");
        });
      } else if (order_data.isDonarFieldBlank === true) {
        notifyA("Order is not been donated by anyone.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const becomevolunteer = () => {
    navigate("/signup");
  };

  const handleAccept = (order) => {
    fetch(`${API_BASE_URL}/volunteer-accept/${order.unverifiedorders._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ VolunteerId: VolunteerId }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the unverifiedorders state after successfully accepting the order
        setUnverifiedOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) => {
            if (o._id === order.unverifiedorders._id) {
              return { ...o, acceptance_status: "accepted" };
            }
            return o;
          });
          return updatedOrders;
        });
        notifyB(data);
      })
      .catch((err) => {
        console.log(err);
        notifyA(err);
      });
  };
  const handleReject = (order) => {
    fetch(`${API_BASE_URL}/volunteer-reject/${order.unverifiedorders._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ VolunteerId: VolunteerId }),
    })
      .then((res) => res.json)
      .then((data) => {
        // Update the unverifiedorders state after successfully rejecting the order
        // remove the rejected order from the state
        const updatedOrder = (preivousOrder) =>
          preivousOrder.filter((o) => o._id !== order.unverifiedorders._id);
        setUnverifiedOrders(updatedOrder);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            generateOTP();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function generateOTP(phoneNumber) {
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        // setShowOTP(true);
        notifyB("OTP sent successfully!");
        setOTPstatus(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onOTPVerify(order_id) {
    window.confirmationResult
      .confirm(OTP)
      .then(async (res) => {
        notifyB("Delivery Done");
        setUnverifiedOrders((prevOrders) => {
          return prevOrders.map((item) =>
            item._id === order_id ? { ...item, execute_status: true } : item
          );
        });
        delivery_order(order_id);

        setOTPstatus(false);
        setOTP("");
        setDeliverModal(false);
        //update the order list and send feedback to the user
      })
      .catch((err) => {});
  }

  const reject_donate_order = (order_id) => {
    fetch(`${API_BASE_URL}/order-rejected/${order_id}`, {
      method: "post",
    })
      .then((res) => res.json())
      .then((data) => {
        setUnverifiedOrders((prevOrders) => {
          return prevOrders.map((item) =>
            item._id === order_id ? { ...item, is_order_rejected: true } : item
          );
        });

        notifyB(data.msg);
      });
  };

  return (
    <div className="vol">
      <div className="bodyy">
        <div className="vcontent">
          {isLoading ? (
            <h1 className="load">Loading...</h1>
          ) : (
            <div className="out_cont">
              <h1 id="pendtitle">Pending Verifications...</h1>
              <br />
              <input
                className="volitemsearch"
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                style={{ border: "none" }}
                placeholder="search by order id"
                name=""
                id=""
              />
              <div className="volunteer_cunt">
                <div className="vpending" id="sgaaafas">
                  <p className="p-head"> Order Type </p>
                  <p className="p-head">Order ID </p>{" "}
                  <p className="p-head">No Of Meds </p>{" "}
                  <p className="p-head">Location </p>
                  <p className="p-head">Donor / Requester</p>
                  <p className="p-head">Action / Status</p>
                  <p className="p-head">Details</p>
                </div>

                <hr className="volhr" id="sgaaafas" />

                {/* {sortedData.filter((unverifiedorders)=>{
                    return search.toLowerCase()=== '' ? unverifiedorders : unverifiedorders.medicine_name.toLowerCase().includes(search)
                  }).map((unverifiedorders) => (<> */}

                {sortedData
                  .filter((unverifiedorders) => {
                    return search === ""
                      ? unverifiedorders
                      : unverifiedorders._id.includes(search);
                  })
                  .map((unverifiedorders) => (
                    <>
                      <div
                        className="vpending"
                        key={unverifiedorders._id.toString().slice(-4)}
                      >
                        <p className="vpdetails">order_type : </p>
                        <p className="h3">{unverifiedorders.order_type}</p>
                        <p className="vpdetails">Order ID : </p>{" "}
                        <p className="h3">
                          {unverifiedorders._id.toString().slice(-4)}
                        </p>
                        <p className="vpdetails">No of Meds : </p>{" "}
                        <p className="h3">{unverifiedorders.no_of_medicines}</p>
                        <p className="vpdetails">location : </p>
                        <p className="h3">
                          {unverifiedorders?.location?.location}
                        </p>
                        {unverifiedorders.order_type == "donate-order" ? (
                          <>
                            <p className="vpdetails">Donar : </p>
                            <p className="h3">{unverifiedorders.donar.name}</p>
                          </>
                        ) : (
                          <>
                            <p className="vpdetails">Requester : </p>
                            <p className="h3">
                              {unverifiedorders.requester.name}
                            </p>
                          </>
                        )}
                        {unverifiedorders.acceptance_status === "pending" ? (
                          <>
                            <p className="vpdetails">Action / Status : </p>
                            <p className="h3">
                              <button
                                onClick={() =>
                                  handleAccept({ unverifiedorders })
                                }
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleReject({ unverifiedorders })
                                }
                              >
                                Deny
                              </button>
                            </p>
                          </>
                        ) : (
                          <>
                            {unverifiedorders.is_order_rejected === true ? (
                              <>
                                <p className="vpdetails">Status : </p>
                                <p>Cancelled</p>{" "}
                              </>
                            ) : unverifiedorders.order_type ==
                              "donate-order" ? (
                              unverifiedorders.verify_status === true ? (
                                <>
                                  <p className="vpdetails">Status : </p>
                                  <p>Verified</p>{" "}
                                </>
                              ) : (
                                <>
                                  <p className="h3">
                                    <button
                                      // className="button-53"
                                      onClick={() =>
                                        verify_donate_order(
                                          unverifiedorders._id
                                        )
                                      }
                                    >
                                      Verify
                                    </button>
                                    <button
                                      // className="button-53"
                                      onClick={() =>
                                        reject_donate_order(
                                          unverifiedorders._id
                                        )
                                      }
                                    >
                                      Reject
                                    </button>
                                  </p>
                                </>
                              )
                            ) : unverifiedorders.execute_status === true ? (
                              <>
                                <p className="vpdetails">Action / Status : </p>
                                <p>Delivered</p>
                              </>
                            ) : (
                              <>
                                <p className="vpdetails">Action : </p>
                                <p className="h3">
                                  <button
                                    className="button-53"
                                    onClick={() => setDeliverModal(true)}
                                  >
                                    Deliver
                                  </button>
                                </p>
                                <Modal
                                  className="Modal__container"
                                  isOpen={deliverModalIsOpen}
                                  onRequestClose={() => setDeliverModal(false)}
                                  style={{
                                    overlay: { zIndex: 9999 },
                                    content: { zIndex: 9999 },
                                  }}
                                >
                                  <p>OTP</p>
                                  <div id="recaptcha-container"> </div>
                                  <div>
                                    <button
                                      onClick={() =>
                                        generateOTP(
                                          unverifiedorders.requester.phone_no
                                        )
                                      }
                                    >
                                      Generate OTP
                                    </button>
                                  </div>
                                  {OTPstatus && (
                                    <>
                                      <OtpInput
                                        value={OTP}
                                        onChange={setOTP}
                                        numInputs={6}
                                        renderSeparator={<span> - </span>}
                                        renderInput={(props) => (
                                          <input {...props} />
                                        )}
                                      />
                                      <button
                                        onClick={() =>
                                          onOTPVerify(unverifiedorders._id)
                                        }
                                      >
                                        Submit
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => setDeliverModal(false)}
                                  >
                                    Close
                                  </button>
                                </Modal>
                              </>
                            )}
                          </>
                        )}
                        <p className="vpdetails">Details : </p>
                        <p className="h3">
                          <Button
                            className="button-53"
                            onClick={() => viewMedicine(unverifiedorders)}
                          >
                            Details
                          </Button>
                        </p>
                        <ViewMedModal id="sdacadk"
                          viewMedModalIsOpen={viewMedModalIsOpen}
                          selectOrder={selectOrder}
                          closeViewMedModal={closeViewMedModal}
                          setSelectedOrder={setSelectOrder}
                          setUnverifiedOrders={setUnverifiedOrders}
                          removeButton={true}
                        />
                      </div>
                    </>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
