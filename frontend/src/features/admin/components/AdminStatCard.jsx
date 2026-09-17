function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        {/* Content */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#17202A]">
            {value}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        {/* Icon */}
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon
            size={21}
            className={iconColor}
          />
        </div>

      </div>

    </div>
  );
}

export default AdminStatCard;