import { SquareLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white space-y-4">
      <SquareLoader color="#3AC3A5" />
    </div>
  );
}
