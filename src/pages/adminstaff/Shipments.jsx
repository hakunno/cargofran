import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { db } from "../../jsfile/firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import Sidebar from "../../component/adminstaff/Sidebar";

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [formData, setFormData] = useState({
    packageNumber: "",
    shipperName: "",
    serviceType: "",
    packageStatus: "",
    paid: false,
    airwayBill: "",
  });

  useEffect(() => {
    const fetchShipments = async () => {
      const querySnapshot = await getDocs(collection(db, "Packages"));
      const shipmentsList = querySnapshot.docs.map((doc, index) => ({
        id: index + 1,
        docId: doc.id,
        ...doc.data(),
      }));
      setShipments(shipmentsList);
    };
    fetchShipments();
  }, []);

  return (
    <div className="flex">
        <Sidebar />

      {/* Main Content (Takes Full Width on Mobile, Shrinks on Desktop) */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Shipment Information</h2>

        <div className="overflow-x-auto">
          <Table striped bordered hover className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Package Number</th>
                <th className="p-2">Shipper</th>
                <th className="p-2">Service</th>
                <th className="p-2">Status</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id} className={`text-center ${shipment.canceled ? "bg-gray-100" : ""}`}>
                  <td className="p-2">{shipment.id}</td>
                  <td className="p-2">{shipment.packageNumber}</td>
                  <td className="p-2">{shipment.shipperName}</td>
                  <td className="p-2">{shipment.serviceType}</td>
                  <td className="p-2">{shipment.packageStatus}</td>
                  <td className="p-2">{shipment.paid ? "Yes" : "No"}</td>
                  <td className="p-2">
                    {shipment.canceled ? (
                      <span className="text-gray-500 font-semibold">Canceled</span>
                    ) : (
                      <>
                        <Button
                          variant="warning"
                          className="mr-2"
                          onClick={() => {
                            setCurrentShipment(shipment);
                            setFormData(shipment);
                            setEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="danger">
                          Cancel
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Button variant="primary" className="mt-4" onClick={() => setShowModal(true)}>
          Add Shipment
        </Button>
      </div>
    </div>
  );
};

export default Shipments;
