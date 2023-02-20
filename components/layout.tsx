import { NavBar, Sidebar } from "./";

const Layout = ({ children }: any) => {
  return (
    <>
      <NavBar />
      <div className="md:flex">
        <div className="md:block hidden">
          <Sidebar />
        </div>
        <main className="w-full">{children}</main>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
