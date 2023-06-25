import { CLOUD_NAME } from "../keys";
import { UPLOAD_PRESET } from "../keys";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
const notifyA = (msg) => toast.error(msg);
const notifyB = (msg) => toast.success(msg);

// upload the image
const uploadImg = (selectedFile, setImgUrl) => {
  const data = new FormData();
  data.append("file", selectedFile);
  data.append("upload_preset", UPLOAD_PRESET);
  data.append("cloud_name", CLOUD_NAME);

  fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "post",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      setImgUrl(data.url);
    })
    .catch((err) => console.log(err));
};

//fetch the user
const fetchUser = (setUserID) => {
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
    });
};

const handleSaveReport = (report_data, userID, setReports, report_type) => {
  fetch(`${API_BASE_URL}/reports`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report_data),
  })
    .then((res) => res.json())
    .then((res) => {
      notifyB("Report Saved");
      fetchReport(userID, setReports, report_type);
    })
    .catch((err) => {
      notifyA("Unable to save report");
      console.log(err);
    });
};

const fetchReport = (userID, setReports, report_type) => {
  fetch(`${API_BASE_URL}/allreports/${userID}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      report_type: report_type,
    }),
  })
    .then((res) => res.json())
    .then((doc) => {
      setReports(doc);
    });
};

export { uploadImg, fetchUser, handleSaveReport, fetchReport };
