import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiTrash2, FiCheckCircle, FiInfo } from "react-icons/fi";

// ─── Modal UI ──────────────────────────────────────────────────────────────────

const VARIANTS = {
  danger:  { icon: FiTrash2,        iconBg: "bg-red-100",    iconColor: "text-red-600",    btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",    label: "Delete"  },
  warning: { icon: FiAlertTriangle, iconBg: "bg-amber-100",  iconColor: "text-amber-600",  btn: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400", label: "Confirm" },
  success: { icon: FiCheckCircle,   iconBg: "bg-green-100",  iconColor: "text-green-600",  btn: "bg-green-600 hover:bg-green-700 focus:ring-green-500", label: "Confirm" },
  info:    { icon: FiInfo,          iconBg: "bg-blue-100",   iconColor: "text-blue-600",   btn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",   label: "Confirm" },
};

export function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, variant = "warning", onConfirm, onCancel }) {
  if (!open) return null;

  const v = VARIANTS[variant] || VARIANTS.warning;
  const Icon = v.icon;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 animate-[fadeInScale_0.18s_ease]"
        style={{ animation: "fadeInScale 0.18s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${v.iconBg}`}>
          <Icon className={`text-2xl ${v.iconColor}`} />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
          {message && <p className="text-sm text-gray-500 leading-relaxed">{message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {cancelLabel || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${v.btn}`}
          >
            {confirmLabel || v.label}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useConfirm()
 * Returns [confirm, ConfirmModalJSX]
 *
 * Usage:
 *   const [confirm, ConfirmUI] = useConfirm();
 *   // in JSX: {ConfirmUI}
 *   // to trigger: const ok = await confirm({ title, message, variant });
 */
export function useConfirm() {
  const [state, setState] = useState({ open: false, title: "", message: "", variant: "warning", confirmLabel: "", cancelLabel: "" });
  const resolveRef = useRef(null);

  const confirm = useCallback(({ title, message, variant = "warning", confirmLabel = "", cancelLabel = "Cancel" } = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ open: true, title, message, variant, confirmLabel, cancelLabel });
    });
  }, []);

  const handleConfirm = () => {
    setState((s) => ({ ...s, open: false }));
    resolveRef.current?.(true);
  };

  const handleCancel = () => {
    setState((s) => ({ ...s, open: false }));
    resolveRef.current?.(false);
  };

  const modal = (
    <ConfirmModal
      open={state.open}
      title={state.title}
      message={state.message}
      variant={state.variant}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return [confirm, modal];
}
