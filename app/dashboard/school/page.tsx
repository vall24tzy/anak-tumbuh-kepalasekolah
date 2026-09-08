import { Metadata } from "next";
import SchoolStructure from "@/components/features/school/SchoolStructure";

export const metadata: Metadata = {
  title: "Sekolah | ANAKTUMBUH.ID Kepala Sekolah",
};

const Page = () => {
  return <SchoolStructure />;
};

export default Page;
