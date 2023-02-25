import { NavBar, Footer } from "./";

const Layout = ({ children }: any) => {
  return (
    <>
      <NavBar />
      <main className="w-full">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
