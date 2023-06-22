import React from "react"
import Modal from 'react-modal';
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import '../css/Modal.css'

const ViewMedModal = ({ viewMedModalIsOpen, selectOrder, closeViewMedModal }) => {
  // console.log(selectOrder)
  return (
    <Modal 
    className="Modal__container" 
    isOpen={viewMedModalIsOpen} 
    onRequestClose={closeViewMedModal}
    style={{
      overlay: {
        zIndex: 9999
      },
      content: {
        zIndex: 9999
      }
    }}
    >
      <h2>Med list</h2>
      <ul>
        {selectOrder && selectOrder.medicines ? (
          selectOrder.medicines.map((med, index) => {
            // console.log("Medicine Name:", med.medicine_name);
            // console.log("Expiry Date:", med.expiry_date);
            // console.log("Quantity:", med.quantity);

            return (
              <React.Fragment key={index}>
                <Card className="Card">
                  <Card.Body>
                    <Card.Title id="title">
                      <img src="pills.png" alt="" />
                      {med.medicine_name}
                    </Card.Title>
                    <Card.Text id="details">
                      { selectOrder.order_type === "donate-order" &&
                        (<p>
                        <div className="content-details">Expiry Date:-</div>
                        {med.expiry_date.date.toString().slice(0, 10)}
                        <br />
                      </p>)}
                      <p>
                        <div className="content-details">Quantity:-</div>
                        {med.quantity}
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
    </Modal>)
};

export default ViewMedModal