import { SafeAreaView } from "@/components/ui/safe-area-view";
import NavBar from "@/components/Layout/NavBar";
import PreFooter from "@/components/Layout/PreFooter";
import Footer from "@/components/Layout/Footer";
import HeadOne from "../about/HeadOne";
import AboutUs from "../about/AboutUs";

const BlogPage = () => {
  return (
    <SafeAreaView>
      <NavBar />
      <HeadOne />
      <AboutUs />
      <PreFooter />
      <Footer />
    </SafeAreaView>
  );
};

export default BlogPage;
