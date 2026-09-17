import {
  AlertTriangle,
  X,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  const config = {
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },

    danger: {
      icon: Trash2,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },

    block: {
      icon: Ban,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
    },

    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
  };

  const current = config[type] || config.warning;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#17202A]">
            Confirmation
          </h2>

          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex flex-col items-center text-center">
            
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${current.iconBg}`}
            >
              <Icon
                size={27}
                className={current.iconColor}
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition ${current.button} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;