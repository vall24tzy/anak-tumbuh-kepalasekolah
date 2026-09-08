import { Metadata } from "next";
import PrincipalOverview from "@/components/features/dashboard/PrincipalOverview";

export const metadata: Metadata = {
  title: "Dashboard | ANAKTUMBUH.ID Kepala Sekolah",
};

const Page = () => {
  return <PrincipalOverview />;
};

export default Page;
