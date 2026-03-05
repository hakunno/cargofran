import React from "react";

const MaintenancePage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
                fontFamily: "'Segoe UI', sans-serif",
                color: "#fff",
                textAlign: "center",
                padding: "2rem",
            }}
        >
            <div style={{ maxWidth: "480px" }}>
                {/* Icon */}
                <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🔧</div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: "2.2rem",
                        fontWeight: "700",
                        marginBottom: "1rem",
                        letterSpacing: "-0.5px",
                    }}
                >
                    System Offline
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.7",
                        color: "#94a3b8",
                        marginBottom: "2rem",
                    }}
                >
                    We have temporarily taken the system offline for maintenance.
                    We will be back shortly. Thank you for your patience.
                </p>

                {/* Divider */}
                <div
                    style={{
                        width: "60px",
                        height: "3px",
                        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        borderRadius: "99px",
                        margin: "0 auto 2rem",
                    }}
                />

                {/* Contact */}
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    For urgent inquiries, please contact us directly.
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
