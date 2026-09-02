import DashboardLayout from "@/layout/DashboardLayout";

type DashboardRouteLayoutProps = {
  children: React.ReactNode;
};

const DashboardRouteLayout = ({ children }: DashboardRouteLayoutProps) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardRouteLayout;
