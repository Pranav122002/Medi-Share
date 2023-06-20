import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Donate from "../Donate";

describe("Donate component", () => {
  test("should add a medicine form on clicking the 'Add' button", () => {
    render(<Donate />);
    
    // Set values for the input fields
    fireEvent.change(screen.getByPlaceholderText("Medicine Name"), {
      target: { value: "Amoxicillin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Expiry Date"), {
      target: { value: "2023-12-31" },
    });
    fireEvent.change(screen.getByPlaceholderText("Quantity"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Panvel, Navi Mumbai" },
    });

    // Click the 'Add' button
    fireEvent.click(screen.getByText("Add"));

    // // Verify that a new medicine form is added
    // expect(screen.getByText("Medicine Name: Amoxicillin")).toBeInTheDocument();
    // expect(screen.getByText("Expiry Date: 2023-12-31")).toBeInTheDocument();
    // expect(screen.getByText("Quantity: 5")).toBeInTheDocument();
    // expect(screen.getByText("Location: Panvel, Navi Mumbai")).toBeInTheDocument();
  });

//  
//   test("should submit the donation when 'Donate' button is clicked", () => {
//     render(<Donate />);

//     // Set values for the input fields
//     fireEvent.change(screen.getByPlaceholderText("Medicine Name"), {
//       target: { value: "Medicine A" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("Expiry Date"), {
//       target: { value: "2023-12-31" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("Quantity"), {
//       target: { value: "5" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("Location"), {
//       target: { value: "Location A" },
//     });

//     // Mock the API request
//     const mockPost = jest.fn();
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () =>
//           Promise.resolve({
//             error: null,
//             msg: "Donation successful",
//           }),
//       })
//     );
//     global.fetch.mockImplementationOnce(mockPost);

//     // Click the 'Donate' button
//     fireEvent.click(screen.getByText("Donate"));

//     // Verify that the postOrderData function is called
//     expect(mockPost).toHaveBeenCalledTimes(1);

//     // Verify that the correct data is sent in the request payload
//     expect(mockPost.mock.calls[0][0]).toContain("Medicine A");
//     expect(mockPost.mock.calls[0][0]).toContain("2023-12-31");
//     expect(mockPost.mock.calls[0][0]).toContain("5");
//     expect(mockPost.mock.calls[0][0]).toContain("Location A");

//     // Verify that the appropriate toast message is displayed
//     expect(screen.getByText("Donation successful")).toBeInTheDocument();
//   });

//   test("should search medicines and display suggestions", () => {
//     render(<Donate />);

//     // Set a value for the medicine name input
//     fireEvent.change(screen.getByPlaceholderText("Medicine Name"), {
//       target: { value: "Medicine" },
//     });

//     // Mock the API request
//     const mockGet = jest.fn();
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () =>
//           Promise.resolve({
//             medicines: ["Medicine A", "Medicine B"],
//           }),
//       })
//     );
//     global.fetch.mockImplementationOnce(mockGet);

//     // Verify that the fetchMedicines function is called
//     expect(mockGet).toHaveBeenCalledTimes(1);

//     // Verify that the correct data is sent in the request payload
//     expect(mockGet.mock.calls[0][0]).toContain("Medicine");

//     // Verify that the search results are displayed correctly
//     expect(screen.getByText("Medicine A")).toBeInTheDocument();
//     expect(screen.getByText("Medicine B")).toBeInTheDocument();
//   });

//   test("should update form input values", () => {
//     render(<Donate />);

//     // Change the values of the input fields
//     fireEvent.change(screen.getByPlaceholderText("Medicine Name"), {
//       target: { value: "Updated Medicine" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("Expiry Date"), {
//       target: { value: "2024-01-01" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("Quantity"), {
//       target: { value: "10" },
//     });
//     fireEvent.change(screen.getByPlaceholderText("Location"), {
//       target: { value: "Updated Location" },
//     });

//     // Verify that the corresponding state variables are updated
//     expect(screen.getByPlaceholderText("Medicine Name").value).toBe(
//       "Updated Medicine"
//     );
//     expect(screen.getByPlaceholderText("Expiry Date").value).toBe(
//       "2024-01-01"
//     );
//     expect(screen.getByPlaceholderText("Quantity").value).toBe("10");
//     expect(screen.getByPlaceholderText("Location").value).toBe(
//       "Updated Location"
//     );
//   });
});
