import { NavBar } from "./";

const Layout = ({ children }: any) => {
  return (
    <>
      <NavBar />
      <main className="w-full">{children}</main>
    
    </>
  );
};

export default Layout;
