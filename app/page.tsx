import { Metadata } from "next";
import LoginForm from "@/components/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | ANAKTUMBUH.ID Kepala Sekolah",
  description: "Sistem Pemantauan 7 Kebiasaan Anak Indonesia Hebat",
};

const Page = () => {
  return (
    <div className="min-h-screen bg-primary-50">
      <div className="mx-auto max-w-md px-5 py-14 sm:py-20">
        <section className="rounded-[2.5rem] border border-white bg-white p-6 shadow-[0_24px_60px_rgba(164,193,253,0.42)] sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-primary-900 sm:text-3xl">
              anaktumbuh<span className="text-secondary-500">.id</span>
            </h1>
            <p className="mt-1 text-sm font-bold text-primary-900/75">Masuk sebagai Kepala Sekolah</p>
            <p className="mx-auto mt-2 max-w-sm text-xs font-semibold leading-5 text-primary-900/55">
              Gunakan username dan password akun Kepala Sekolah untuk melanjutkan.
            </p>
          </div>

          <LoginForm />
        </section>
      </div>
    </div>
  );
};

export default Page;
