import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { auth, db } from "../jsfile/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { FaPrint, FaEye, FaCommentDots, FaBoxOpen } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const UserShipmentHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [infoHistory, setInfoHistory] = useState([]);
  const [infoLoading, setInfoLoading] = useState(false);
  const [userChatPackages, setUserChatPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const printRef = useRef();
  const currentDate = new Date().toLocaleDateString();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Shipment History Report",
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `
      @page { size: landscape; margin: 12mm 14mm; }
      @media print {
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; width: 100%; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-section { width: 100% !important; box-shadow: none !important; border-radius: 0 !important; background: #fff !important; padding: 0 !important; border: none !important; }
        .print-header { display: block !important; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #000; text-align: center; }
        .print-header h2 { font-size: 14pt; font-weight: bold; margin: 0; text-align: center; }
        .print-header .subtitle { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 4px 0; color: #555; }
        .print-header .narrative { font-size: 8pt; margin: 4px 0; line-height: 1.4; }
        .print-header .meta { display: flex; justify-content: space-between; font-size: 7pt; color: #555; margin-top: 3px; }
        table { width: 100% !important; border-collapse: collapse !important; font-size: 7.5pt; table-layout: auto; page-break-inside: auto; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th { background-color: #e8e8e8 !important; font-weight: 700; color: #000 !important; text-transform: uppercase; font-size: 6.5pt; letter-spacing: 0.04em; padding: 5px 6px; border: 1px solid #000 !important; text-align: left; }
        td { border: 1px solid #000 !important; padding: 4px 6px; vertical-align: middle; color: #000 !important; background-color: #fff !important; font-size: 7.5pt; }
        tr:nth-child(even) td { background-color: #f5f5f5 !important; }
        .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; width: 100% !important; }
        .no-print { display: none !important; }
        .print-footer { display: none !important; }
      }
    `,
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("You must be logged in to view your shipment history.");
        setEntries([]);
        setLoading(false);
        return;
      }

      const authEmail = user.email || "";
      const uid = user.uid;

      try {
        const safeQuery = async ({ collectionName, whereField, orderValue, orderField }) => {
          try {
            const q = query(
              collection(db, collectionName),
              where(whereField, "==", orderValue),
              orderBy(orderField, "desc")
            );
            const snap = await getDocs(q);
            return snap.docs.map((d) => ({ docId: d.id, collection: collectionName, ...d.data() }));
          } catch (err) {
            try {
              const qFallback = query(collection(db, collectionName), where(whereField, "==", orderValue));
              const snapFallback = await getDocs(qFallback);
              return snapFallback.docs.map((d) => ({ docId: d.id, collection: collectionName, ...d.data() }));
            } catch {
              return [];
            }
          }
        };

        const [packagesDocs, requestsDocs] = await Promise.all([
          safeQuery({ collectionName: "Packages", whereField: "email", orderValue: authEmail, orderField: "createdTime" }),
          safeQuery({ collectionName: "shipRequests", whereField: "email", orderValue: authEmail, orderField: "createdAt" }),
        ]);

        const normalizeTimestamp = (doc) => {
          const t = doc.createdTime || doc.createdAt || doc.requestTime || doc.dateStarted || null;
          if (!t) return 0;
          if (typeof t.toDate === "function") return t.toDate().getTime();
          const parsed = new Date(t).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };

        let merged = [...packagesDocs, ...requestsDocs]
          .map((d) => ({ ...d, _ts: normalizeTimestamp(d) }))
          .filter((d) => d && d.collection);
        merged.sort((a, b) => b._ts - a._ts);
        setEntries(merged);

        if (uid) {
          const chatSnap = await getDocs(query(collection(db, "shipment_conversations"), where("userId", "==", uid)));
          setUserChatPackages(chatSnap.docs.map((doc) => doc.data().packageNumber));
        }
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Failed to load shipments. Please try again later.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const openInfoModal = async (entry) => {
    setCurrentEntry(entry);
    setInfoLoading(true);
    setInfoHistory([]);
    setInfoModal(true);

    if (entry.collection === "Packages") {
      try {
        const q = query(collection(db, "Packages", entry.docId, "statusHistory"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        setInfoHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setInfoHistory([]);
      } finally {
        setInfoLoading(false);
      }
    } else {
      setInfoHistory([]);
      setInfoLoading(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch { }
    return String(ts);
  };

  const getAcceptanceStatus = (e) => {
    if (!e || !e.collection) return "Unknown";
    if (e.collection === "Packages") return "Accepted";
    if (e.status === "Processing" || !e.status) return "Pending";
    if (e.status === "Rejected") return "Rejected";
    if (e.status === "Accepted") return "Accepted";
    return "Unknown";
  };

  const getPackageNumber = (e) => {
    if (!e) return "N/A";
    return getAcceptanceStatus(e) === "Accepted" ? (e.packageNumber || "N/A") : "N/A";
  };

  const statusBadge = (status) => {
    const map = {
      Accepted: "bg-green-100 text-green-700 border border-green-300",
      Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
      Rejected: "bg-red-100 text-red-700 border border-red-300",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  // Filter entries
  const filteredEntries = entries.filter(e => {
    const status = getAcceptanceStatus(e);
    const pkgNo = getPackageNumber(e).toLowerCase();
    const from = (e.senderCountry || "").toLowerCase();
    const to = (e.destinationCountry || "").toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = pkgNo.includes(q) || from.includes(q) || to.includes(q) || status.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const TABLE_HEADERS = ["#", "Status", "Package No.", "From", "Destination", "Shipment Status", "Date"];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">Loading your shipment history...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center text-red-500 p-4">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-4 md:p-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 no-print">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Shipment History</h1>
            <p className="text-xs text-gray-400 mt-0.5">{filteredEntries.length} record{filteredEntries.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-64 pl-4 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            {/* Status Filter */}
            <div className="flex bg-white border border-gray-200 p-1 rounded-lg">
              {["All", "Accepted", "Pending", "Rejected"].map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handlePrint}
              disabled={isPrinting || filteredEntries.length === 0}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-sm"
            >
              <FaPrint size={13} />
              {isPrinting ? "Preparing..." : "Print Report"}
            </button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <FaBoxOpen size={48} className="mb-4 opacity-30" />
            <p className="text-sm font-bold uppercase tracking-wider">No shipments or requests found</p>
          </div>
        ) : (
          <div ref={printRef} className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-sm print-section">

            {/* PRINT HEADER (hidden on screen) */}
            <div className="print-header hidden text-center">
              <h2>Shipment History</h2>
            </div>

            {/* ── SCREEN TABLE (paginated) — shown only on screen ── */}
            <div className="overflow-x-auto w-full no-print">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200 border-b-2 border-black sticky top-0 z-10">
                  <tr>
                    {["#", "Status", "Package No.", "From", "Destination", "Shipment Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="border border-black px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedEntries.map((e, idx) => {
                    const acceptStatus = getAcceptanceStatus(e);
                    const pkgNo = getPackageNumber(e);
                    const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr key={`${e.collection}-${e.docId}`} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-200 px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">{rowNum}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs whitespace-nowrap">{statusBadge(acceptStatus)}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs text-gray-700 font-semibold whitespace-nowrap">{pkgNo}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{e.senderCountry || "N/A"}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{e.destinationCountry || "N/A"}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{e.packageStatus || e.status || "N/A"}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTimestamp(e.createdTime || e.createdAt || e.requestTime || e.dateStarted)}</td>
                        <td className="border border-gray-200 px-4 py-3 text-xs">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openInfoModal(e)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 rounded-md text-[10px] font-bold transition-all"
                            >
                              <FaEye size={10} /> View
                            </button>
                            {acceptStatus === "Accepted" && userChatPackages.includes(pkgNo) && (
                              <button
                                onClick={() => navigate("/ShipmentMessages", { state: { packageNumber: pkgNo } })}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[10px] font-bold transition-all"
                              >
                                <FaCommentDots size={10} /> Message
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── PRINT TABLE (full data, hidden on screen, shown in print) ── */}
            <div className="hidden print:block w-full">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200 border-b-2 border-black">
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="border border-black px-3 py-2 text-left text-[10px] font-bold text-black uppercase tracking-wider bg-gray-200">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((e, idx) => (
                    <tr key={`print-${e.collection}-${e.docId}`}>
                      <td className="border border-black px-3 py-1.5 text-xs">{idx + 1}</td>
                      <td className="border border-black px-3 py-1.5 text-xs">{getAcceptanceStatus(e)}</td>
                      <td className="border border-black px-3 py-1.5 text-xs font-semibold">{getPackageNumber(e)}</td>
                      <td className="border border-black px-3 py-1.5 text-xs">{e.senderCountry || "N/A"}</td>
                      <td className="border border-black px-3 py-1.5 text-xs">{e.destinationCountry || "N/A"}</td>
                      <td className="border border-black px-3 py-1.5 text-xs">{e.packageStatus || e.status || "N/A"}</td>
                      <td className="border border-black px-3 py-1.5 text-xs">{formatTimestamp(e.createdTime || e.createdAt || e.requestTime || e.dateStarted)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PRINT FOOTER */}
            <div className="print-footer hidden">
              <span>Printed by: User Account</span>
              <span>Date: {currentDate}</span>
            </div>
          </div>
        )}

        {/* ── PAGINATION (screen only) ── */}
        {totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
            <p className="text-xs text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredEntries.length)} of {filteredEntries.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-xs font-bold rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >«</button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-bold rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - currentPage) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md border transition ${p === currentPage ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                  >{p}</button>
                ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-bold rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >Next</button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 text-xs font-bold rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >»</button>
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      <Modal show={infoModal} onHide={() => { setInfoModal(false); setCurrentEntry(null); setInfoHistory([]); }} size="lg" centered>
        <Modal.Header closeButton className="border-b-2 border-gray-100">
          <Modal.Title className="text-base font-extrabold text-gray-800 tracking-tight">
            {currentEntry ? `Shipment #${getPackageNumber(currentEntry)}` : "Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5">
          {infoLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {currentEntry && (
                <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100 text-sm">
                  <div><span className="text-xs text-gray-400 font-bold uppercase block">Email</span><span className="text-gray-700 font-medium">{currentEntry.email || "N/A"}</span></div>
                  <div><span className="text-xs text-gray-400 font-bold uppercase block">Status</span>{statusBadge(getAcceptanceStatus(currentEntry))}</div>
                  <div className="col-span-2"><span className="text-xs text-gray-400 font-bold uppercase block">Created</span><span className="text-gray-700 font-medium">{formatTimestamp(currentEntry.createdTime || currentEntry.createdAt || currentEntry.requestTime)}</span></div>
                </div>
              )}

              {currentEntry?.collection === "Packages" ? (
                <>
                  <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Status History</h6>
                  {infoHistory.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No status history available.</p>
                  ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-100 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">#</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                          {infoHistory.map((h, idx) => (
                            <tr key={h.id || idx} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-xs text-gray-500">{infoHistory.length - idx}</td>
                              <td className="px-4 py-2 text-xs font-semibold text-gray-700">{h.status}</td>
                              <td className="px-4 py-2 text-xs text-gray-500">{formatTimestamp(h.timestamp)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Request Details</h6>
                  {getAcceptanceStatus(currentEntry) === "Pending" ? (
                    <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4">Your request is currently pending review.</p>
                  ) : getAcceptanceStatus(currentEntry) === "Rejected" ? (
                    <p className="text-sm text-gray-500 bg-red-50 border border-red-200 rounded-lg p-4">This request was rejected.</p>
                  ) : (
                    <pre className="text-xs text-gray-600 bg-gray-50 border rounded-lg p-4 overflow-auto" style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(currentEntry, null, 2)}</pre>
                  )}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-100">
          <button
            onClick={() => { setInfoModal(false); setCurrentEntry(null); setInfoHistory([]); }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserShipmentHistory;
