import { ReactNode } from "react";
import SpinLoader from "@/components/ui/Loader/SpinLoader";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";

type AsyncStateProps = {
  loading: boolean;
  error: string | null;
  children: ReactNode;
};

// Guard loading/error yang dipakai berulang di tiap halaman data-fetching,
// ditarik jadi satu komponen biar orchestrator halaman lebih ringkas.
function AsyncState({ loading, error, children }: AsyncStateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <SpinLoader size={48} />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return <>{children}</>;
}

export default AsyncState;
