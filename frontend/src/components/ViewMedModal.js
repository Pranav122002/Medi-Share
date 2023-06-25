import React, { useEffect } from "react";
import Modal from "react-modal";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Modal.css";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";


const ViewMedModal = ({
  viewMedModalIsOpen,
  selectOrder,
  closeViewMedModal,
  setSelectedOrder,
  setUnverifiedOrders,
  removeButton
}) => {
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const handleRemoveMed = (order_id, med_id, med_quantity) => {
    console.log(order_id, med_id)
    fetch(`${API_BASE_URL}/remove-med/${order_id}`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ med_id: med_id, med_quantity: med_quantity})
      }
    )
      .then(res => res.json())
      .then((data) => {
        notifyB("Remove successfully")
        setSelectedOrder(data.updatedOrder)
        setUnverifiedOrders((preOrders) =>
        preOrders.map((order) =>
          order._id === data.updatedOrder._id ? data.updatedOrder : order
        )
      );
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Modal
      className="Modal__container"
      isOpen={viewMedModalIsOpen}
      onRequestClose={closeViewMedModal}
      
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          zIndex: 9999,
        },
      }}
    >
      <h2>Med list</h2>
      <ul>
        {selectOrder && selectOrder.medicines ? (
          selectOrder.medicines.map((med, index) => {
            return (
              <React.Fragment key={index}>
                <Card className="Card">
                  <Card.Body>
                    <Card.Title id="title">{med.medicine_name}</Card.Title>
                    <Card.Text id="details">
                      {selectOrder.order_type === "donate-order" && (
                        <p>
                          <div className="content-details">
                            Expiry Date:{" "}
                            {med.expiry_date.date.toString().slice(0, 10)}{" "}
                          </div>
                        </p>
                      )}
                      <p>
                        <div className="content-details">
                          Quantity: {med.quantity}
                        </div>
                        <br />
                      </p>
                      <p id="dkijajcac">
                      {console.log(selectOrder.verify_status)}
                      {console.log(selectOrder.execute_status)}
                      {selectOrder.execute_status === false && selectOrder.verify_status === false && selectOrder.acceptance_status === "accepted" && (
                        <button  onClick={() => handleRemoveMed(selectOrder._id, med._id, med.quantity)}>Remove</button>
                      )}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </React.Fragment>
            );
          })
        ) : (
          <p>No medicines available</p>
        )}
      </ul>
      <button onClick={closeViewMedModal}>Close</button>
    </Modal>
  );
};

export default ViewMedModal;
