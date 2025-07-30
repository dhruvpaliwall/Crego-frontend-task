const variants = {
  primary: "bg-indigo-500 text-white hover:bg-indigo-600",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  tertiary:
    "bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2",
  lg: "px-4 py-3 text-lg",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-md
        transition-colors
        duration-200
        font-medium
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-indigo-500
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
