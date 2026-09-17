function StatCard({
  title,
  value,
  icon,
  description,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
      
      <div className="flex items-start justify-between">
        
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {value}
          </h3>

          {description && (
            <p className="text-xs text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;