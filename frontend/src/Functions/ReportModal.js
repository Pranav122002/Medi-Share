import React from "react";
import Modal from "react-modal";

const ReportModal = ({
  reportModal,
  handleCLoseModal,
  reports,
  setImageModal,
  handleCloseImageModal,
  imageModal,
  setReportModal
}) => {
  return (
    <Modal
      className="Modal__container"
      isOpen={reportModal}
      onRequestClose={handleCLoseModal}
      style={{
        overlay: {
          zIndex: 9999
        },
        content: {
          zIndex: 9999
        }
      }}
    >
      {reports.map((report, index) => {
        return (
          <div key={index}>
            <p>Report: {report._id.toString().slice(-4)}</p>
            <p>Result: {report.result}</p>
            <p>Date: {report.report_creation_date}</p>
            <button onClick={() => setImageModal(true)}>Image</button>
            <Modal
              className="Modal__container"
              isOpen={imageModal}
              onRequestClose={handleCloseImageModal}
              style={{
                overlay: {
                  zIndex: 9999
                },
                content: {
                  zIndex: 9999
                }
              }}
            >
              <img src={report.image_url} />
              <button onClick={() => setImageModal(false)}>Close</button>
            </Modal>
          </div>
        );
      })}
      <button onClick={() => setReportModal(false)}>Close</button>
    </Modal>
  );
};

export default ReportModal;
