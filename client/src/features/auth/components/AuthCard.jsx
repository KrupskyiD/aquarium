const AuthCard = ({ children }) => {
  return (
    <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-lg">
      {children}
    </div>
  );
};

export default AuthCard;
