import { Metadata } from "next";
import TeacherManagement from "@/components/features/teacher/TeacherManagement";

export const metadata: Metadata = {
  title: "Wali Kelas | ANAKTUMBUH.ID Kepala Sekolah",
};

const Page = () => {
  return <TeacherManagement />;
};

export default Page;
