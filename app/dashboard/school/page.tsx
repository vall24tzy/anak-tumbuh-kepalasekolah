import { Metadata } from "next";
import SchoolStructure from "@/components/features/school/SchoolStructure";

export const metadata: Metadata = {
  title: "Sekolah | ANAKHEBAT.ID Kepala Sekolah",
};

const Page = () => {
  return <SchoolStructure />;
};

export default Page;
