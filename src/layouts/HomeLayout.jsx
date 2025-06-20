import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";

function HomeLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default HomeLayout;
