import React, { useEffect, useState, useContext } from "react";
import "../css/Inventory.css";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Modal from "react-modal";
import Hnavbar from "./Hnavbar";
import "../css/Modal.css";
import { API_BASE_URL } from "../config";
import "../css/Modal.css";
import geocode from "./geocodeFun";
import * as Yup from "yup";
import googleGeocode from "./googleGeocode"

export default function Inventory() {

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectMedicine, setSelectMedicine] = useState(null);
  const [totalMedCount, setTotalMedCount] = useState(0);
  const [cartModal, setCartModal] = useState(false);
  const [userID, setUserID] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [reset_date, set_reset_date] = useState('')
  // Future update:
  //
  const addToCart = (item) => {
    fetch(`${API_BASE_URL}/user-cart/${userID}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          med_id: item._id,
          medicine_name: item.medicine_name,
          quantity: 1,
        },
      ]),
    })
      .then((res) => res.json)
      .then((doc) => {
        setCart((already_in_the_cart) => [
          ...already_in_the_cart,
          {
            medicine_name: item.medicine_name,
            quantity: 1,
            med_id: item._id,
          },
        ]);
      })
      .catch((err) => console.log(err));
  };
  const OpenCartModal = () => {
    setCartModal(true);
  };
  const CloseCartModal = () => {
    setCartModal(false);
  };

  const handleLocation = () => {
    setLocation();
  };

  const fetchMedicines = (query) => {
    setSearch(query);
    fetch(`${API_BASE_URL}/search-medicines`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setSearchResult(results.medicine);
      });
  };

  const getMedicine = () => {
    fetch(`${API_BASE_URL}/allmedicines`)
      .then((res) => res.json())
      .then((doc) => {
        setSearchResult(doc);
      })
      .catch((err) => console.log(err));
  };

  const fetchUser = () => {
    fetch(
      `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setUserID(result._id);
        set_reset_date(result.reset_date)
        setTotalMedCount(result?.medicine_request_limit)
        setCart(result.cart);
      });
  };

  const removeMed = (med) => {
    setCart((preCart) =>
      preCart.filter((item) => item.medicine_name !== med.medicine_name)
    );
    fetch(`${API_BASE_URL}/delete-cart-item/${userID}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        medId: med._id,
      }),
    }).then((res) => res.json);
  };

  const checkout = () => {

    Promise.all(
      cart.map((med) => {
        return (quantityValidation
          .validate({ quantity: med.quantity }, { abortEarly: false })
          .then((res) => { })
          .catch((err) => {
            notifyA(`${med.medicine_name}:  ${err.message}`);
            throw err;
          }))
      })
    )
      .then(async () => {
        await locationValidation.validate(
          { location: location },
          { abortEarly: false })
          .catch(err => {
            notifyA(err.message)
            throw err
          })
        console.log("totalcoutn")

        console.log("for Each : ", totalMedCount)
        return googleGeocode(location);
      })
      .then(async (coordinates_) => {
        setCoordinates(coordinates_)

      })
      .then(async () => {
        // var total = 0

      })
      .then(async (location_val) => {
        var total = 0
        cart.forEach((med) => total = total + med.quantity)
        console.log("total: ", total)
        await totalMedCountVali
          .validate({ totalMedCount: totalMedCount - total }, { abortEarly: false })
          .catch((err) => {
            notifyA(err.message);
            throw err;
          })
        return await fetch(`${API_BASE_URL}/medicine-availablity`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart,
            userID,
            location,
            coordinates,
            location_val,
            medicine_request_limit: totalMedCount - total,
            totalmeds: total
          }),
        });
      })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          notifyB(result.success);
          var total = 0
          cart.forEach((med) => total = total + med.quantity)
          setTotalMedCount((preCount) => preCount - total)
          setCart([]);
          setLocation("")
          setCoordinates(null)

        } else if (result.error) {
          notifyA(result.error);
        } else {
          notifyA(`${result.join(" ")} not available in sufficient quantity`);
        }
      })
      .catch((error) => {
        // console.log(error);
        // notifyA(error.message); 
      });
  };
  //Validation section
  const quantityValidation = Yup.object().shape({
    quantity: Yup.number()
      .min(1, "Quantity can not be less than one")
      .max(10, " Maximum limit for requesting each medicine is 10.")
  });

  const locationValidation = Yup.object().shape({
    location: Yup.string().required("Location is required"),
  });

  const totalMedCountVali = Yup.object().shape({
    totalMedCount: Yup.number()
      .min(0, "Limit exceeded")
      .required("Total Med Count required")
  })
  // const fetchMedicines
  useEffect(() => {
    fetchUser();
    getMedicine();
  }, []);

  const locationInput = document.getElementById("dasdaf");
  const searchBox = new window.google.maps.places.SearchBox(locationInput);

  //limit renewal time
  const currentDate = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.round((new Date(reset_date) - currentDate) / millisecondsPerDay);


  useEffect(() => {
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places && places.length > 0) {
        // Set the location place to the first result

        const selected = places[0].formatted_address;
        setLocation(selected);
      }
    });
  }, [location]);

  return (
    <div className="inventorymain">
      <h1>Inventory</h1>
      <div className="bodyy">
        <div className="searchcolumn">
          <div className="searchbox">
            <div className="topsearch">
               
              <input
                className="searchinput"
                type="text"
                placeholder="Search medicines"
                value={search}
                onChange={(e) => fetchMedicines(e.target.value)}
              />
              {totalMedCount === 0 ? <button style={{background:"gray"}} disabled={true} className="cart-button" onClick={OpenCartModal}>
                Cart
              </button> :
                <button className="cart-button" onClick={OpenCartModal}>
                  Cart
                </button>}

            </div>
            <Modal
              className="Modal__container"
              isOpen={cartModal}
              onRequestClose={CloseCartModal}
            >
              {cart.map((med) => (
                <ul key={med.med_id}>
                  <li className="item_container">
                    <div>
                      <input
                        type="number"
                        value={med.quantity}
                        onChange={(e) => {
                          const newQuantity = Number(e.target.value);

                          setCart((prevCart) =>
                            prevCart.map((item) =>
                              item.medicine_name === med.medicine_name
                                ? { ...item, quantity: newQuantity }
                                : item
                            )
                          );
                        }}
                      />
                      {"x      "}
                      {"  " + med.medicine_name}
                    </div>
                    <button onClick={() => removeMed(med)}>Remove</button>
                  </li>
                </ul>
              ))}

              {cart.length ? (
                <>
                  <input
                    type="text"
                    placeholder="Delivery Location"
                    onChange={(e) => setLocation(e.target.value)}
                    id="dasdaf"
                  />
                  <br />
                  <button id="gasgfa" onClick={checkout}>
                    Checkout
                  </button>
                </>
              ) : (
                <p>Nothing in cart</p>
              )}

              <button onClick={CloseCartModal}>Close</button>
            </Modal>
            <div className="limits">
                <h3>Number of medicine requests left: {totalMedCount} medicines</h3>
                
                {!totalMedCount?(<h3>Number of days left for more requests: {daysLeft} days</h3>):<></>}
            </div>
            <div className="box-container">
              {searchResult.map((item) => {
                return (
                  <div className="box" key={item._id}>
                    <h3 style={{ color: "black" }}> {item.medicine_name}</h3>
                    <p className="p1">{item.description}</p>
                    <p className="p2" style={{ color: "black" }}>
                      {item.disease}
                    </p>
                    <p id="d2sdvyuaca" className="p1">
                      {totalMedCount === 0 ? "Request Limit Exceeded" : item.count <= 0 ? (
                        <p>Out of Stock</p>
                      ) : (
                        <>
                          {item.count <= 10 ? (
                            <>
                              <p>only {item.count} left</p>
                              {cart.some(
                                (cartItem) =>
                                  cartItem.medicine_name === item.medicine_name
                              ) ? (
                                <button disabled>already in Cart</button>
                              ) : (
                                <button onClick={() => addToCart(item)}>
                                  Add to Cart
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <p>In Stock</p>
                              {cart.some(
                                (cartItem) =>
                                  cartItem.medicine_name === item.medicine_name
                              ) ? (
                                <button disabled>already in Cart</button>
                              ) : (
                                <button onClick={() => addToCart(item)}>
                                  Add to Cart
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
