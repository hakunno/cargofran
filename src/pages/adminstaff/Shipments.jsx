import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "../../jsfile/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Sidebar from "../../component/adminstaff/Sidebar";

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [formData, setFormData] = useState({
    packageNumber: "",
    shipperName: "",
    from: "",
    destination: "",
    email: "",
    serviceType: "",
    packageStatus: "On the way",
    paid: false,
    airwayBill: "",
    dateStarted: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("customId");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchShipments = async () => {
      const querySnapshot = await getDocs(collection(db, "Packages"));
      const shipmentsList = querySnapshot.docs.map((docSnap) => ({
        customId: docSnap.data().customId,
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      setShipments(shipmentsList);
    };
    fetchShipments();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    const queryLower = searchQuery.toLowerCase();
    return (
      (shipment.packageNumber || "").toLowerCase().includes(queryLower) ||
      (shipment.shipperName || "").toLowerCase().includes(queryLower) ||
      (shipment.serviceType || "").toLowerCase().includes(queryLower)
    );
  });

  const sortedShipments = filteredShipments.sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleAddShipment = async () => {
    if (
      !formData.packageNumber ||
      !formData.shipperName ||
      !formData.serviceType
    ) {
      alert("Please fill in Package Number, Shipper Name, and Service Type.");
      return;
    }
    const confirmAdd = window.confirm(
      "Are you sure you want to add this shipment?"
    );
    if (!confirmAdd) return;

    const maxId = shipments.reduce(
      (acc, s) => Math.max(acc, s.customId || 0),
      0
    );
    const newCustomId = maxId + 1;
    const newShipment = {
      ...formData,
      customId: newCustomId,
      dateStarted: new Date().toISOString(),
      createdTime: serverTimestamp(),
    };

    try {
      // Add the shipment to the Packages collection
      const docRef = await addDoc(collection(db, "Packages"), newShipment);

      // Create the initial status entry in the statusHistory subcollection
      await addDoc(collection(db, "Packages", docRef.id, "statusHistory"), {
        status: formData.packageStatus,
        timestamp: serverTimestamp(),
      });

      setShipments((prev) => [
        ...prev,
        { customId: newCustomId, docId: docRef.id, ...newShipment },
      ]);
      setShowModal(false);
      setFormData({
        packageNumber: "",
        shipperName: "",
        from: "",
        destination: "",
        email: "",
        serviceType: "",
        packageStatus: "On the way",
        paid: false,
        airwayBill: "",
        dateStarted: null,
      });
    } catch (error) {
      console.error("Error adding shipment:", error);
      alert("Failed to add shipment. Please try again.");
    }
  };

  const handleEditShipment = async () => {
    if (currentShipment) {
      const confirmEdit = window.confirm(
        "Are you sure you want to save changes?"
      );
      if (confirmEdit) {
        try {
          // Check if the status has changed to record a status history entry
          const statusChanged =
            formData.packageStatus !== currentShipment.packageStatus;

          // Merge the formData with the updatedTime field.
          const updatedData = {
            ...formData,
            updatedTime: serverTimestamp(),
          };

          await updateDoc(doc(db, "Packages", currentShipment.docId), updatedData);

          // If status has changed, add a new document to the statusHistory subcollection
          if (statusChanged) {
            await addDoc(
              collection(db, "Packages", currentShipment.docId, "statusHistory"),
              {
                status: formData.packageStatus,
                timestamp: serverTimestamp(),
              }
            );
          }

          setShipments((prev) =>
            prev.map((s) =>
              s.docId === currentShipment.docId ? { ...s, ...updatedData } : s
            )
          );
          setEditModal(false);
          setCurrentShipment(null);
        } catch (error) {
          console.error("Error updating shipment:", error);
          alert("Failed to update shipment. Please try again.");
        }
      }
    }
  };

  const handleCancelShipment = async (shipment) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this shipment?"
    );
    if (confirmCancel) {
      try {
        await updateDoc(doc(db, "Packages", shipment.docId), {
          canceled: true,
          updatedTime: serverTimestamp(),
        });
        setShipments((prev) =>
          prev.map((s) =>
            s.docId === shipment.docId ? { ...s, canceled: true } : s
          )
        );
      } catch (error) {
        console.error("Error canceling shipment:", error);
        alert("Failed to cancel shipment. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 relative">
        <h2 className="text-xl font-semibold text-center mb-6">
          Shipment Information
        </h2>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            className="w-full md:w-1/2 p-2 border rounded"
            placeholder="Search shipments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto overflow-y-auto shadow rounded-lg max-h-[70vh] md:max-h-[75vh]">
          <Table striped bordered hover className="min-w-full">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("customId")}
                >
                  ID {sortField === "customId" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-2">Package Number</th>
                <th className="p-2">Shipper</th>
                <th className="p-2">Service</th>
                <th className="p-2">From</th>
                <th className="p-2">Status</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Email</th>
                <th className="p-2">Airway Bill</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Date Started</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedShipments.map((shipment) => (
                <tr
                  key={shipment.docId}
                  className={`text-center ${shipment.canceled ? "bg-gray-100" : ""}`}
                >
                  <td className="p-2">{shipment.customId || shipment.docId}</td>
                  <td className="p-2">{shipment.packageNumber}</td>
                  <td className="p-2">{shipment.shipperName}</td>
                  <td className="p-2">{shipment.serviceType}</td>
                  <td className="p-2">{shipment.from || "N/A"}</td>
                  <td className="p-2">{shipment.packageStatus}</td>
                  <td className="p-2">{shipment.destination || "N/A"}</td>
                  <td className="p-2">{shipment.email || "N/A"}</td>
                  <td className="p-2">{shipment.airwayBill || "N/A"}</td>
                  <td className={`p-2 ${shipment.paid ? "bg-green-200" : "bg-red-200"}`}>
                    {shipment.paid ? "Yes" : "No"}
                  </td>
                  <td className="p-2">
                    {shipment.dateStarted
                      ? new Date(shipment.dateStarted).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-2">
                    {shipment.canceled ? (
                      <span className="text-gray-500 font-semibold">Canceled</span>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => {
                            setCurrentShipment(shipment);
                            setFormData(shipment);
                            setEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelShipment(shipment)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="mt-4 flex justify-center md:justify-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Shipment
          </Button>
        </div>

        {/* Add Shipment Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Shipment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Package Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.packageNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, packageNumber: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Shipper Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.shipperName}
                  onChange={(e) =>
                    setFormData({ ...formData, shipperName: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.from}
                  onChange={(e) =>
                    setFormData({ ...formData, from: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Service Type</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option>Import & Export (Air/Sea Freight)</option>
                  <option>Domestic (Air/Sea Freight)</option>
                  <option>Full Container Load (FCL)</option>
                  <option>Less than Container Load (LCL)</option>
                  <option>Pick-up and Delivery</option>
                  <option>Full Truckload (FTL)</option>
                  <option>Less than Truckload (LTL)</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Airway Bill (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.airwayBill}
                  onChange={(e) =>
                    setFormData({ ...formData, airwayBill: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email (Optional)</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Package Status</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.packageStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, packageStatus: e.target.value })
                  }
                >
                  <option>Processing</option>
                  <option>On the way</option>
                  <option>In warehouse</option>
                  <option>On transit</option>
                  <option>Landed</option>
                  <option>Delivered</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Paid"
                  checked={formData.paid}
                  onChange={(e) =>
                    setFormData({ ...formData, paid: e.target.checked })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddShipment}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Shipment Modal */}
        <Modal show={editModal} onHide={() => setEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Shipment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Package Number</Form.Label>
                <p className="form-control-plaintext">{formData.packageNumber}</p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Shipper Full Name</Form.Label>
                <p className="form-control-plaintext">{formData.shipperName}</p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.from}
                  onChange={(e) =>
                    setFormData({ ...formData, from: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Airway Bill</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.airwayBill}
                  onChange={(e) =>
                    setFormData({ ...formData, airwayBill: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Package Status</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.packageStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, packageStatus: e.target.value })
                  }
                >
                  <option>Processing</option>
                  <option>On the way</option>
                  <option>In warehouse</option>
                  <option>On transit</option>
                  <option>Landed</option>
                  <option>Delivered</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Paid"
                  checked={formData.paid}
                  onChange={(e) =>
                    setFormData({ ...formData, paid: e.target.checked })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditShipment}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Shipments;
