import { useLoader } from "../context/LoaderContext/page";
import LoadingAnimation from "./LoadingPage";

const GlobalLoader = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      <LoadingAnimation />
    </div>
  );
};

export default GlobalLoader;
