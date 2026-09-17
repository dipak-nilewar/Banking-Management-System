import { createContext, useContext, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <Notification
          notification={notification}
          onClose={closeNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}

function Notification({ notification, onClose }) {
  const { message, type } = notification;

  const config = {
    success: {
      icon: CheckCircle,
      title: "Success",
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
    },
    error: {
      icon: XCircle,
      title: "Error",
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-800",
    },
    warning: {
      icon: AlertTriangle,
      title: "Warning",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-800",
    },
    info: {
      icon: Info,
      title: "Information",
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
    },
  };

  const current = config[type] || config.success;
  const Icon = current.icon;

  return (
    <div className="fixed right-6 top-6 z-[9999] w-[380px] animate-in slide-in-from-right-5 fade-in duration-300">
      <div
        className={`flex items-start gap-3 rounded-2xl border ${current.border} ${current.bg} p-4 shadow-xl`}
      >
        <Icon
          size={23}
          className={`${current.iconColor} mt-0.5 shrink-0`}
        />

        <div className="flex-1">
          <p className={`text-sm font-semibold ${current.titleColor}`}>
            {current.title}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}