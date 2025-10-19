export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-600 text-lg font-medium">Loading...</p>
    </div>
  );
}
