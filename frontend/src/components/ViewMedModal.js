import React from "react";
import Modal from "react-modal";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "../css/Modal.css";

const ViewMedModal = ({
  viewMedModalIsOpen,
  selectOrder,
  closeViewMedModal,
}) => {
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
