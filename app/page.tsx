import HomeContent from "./home/page";
import Things from "./things/page";
import Works from "./works/page";
import PreviewMap from "./previewMap/page";
import AboutPage from "./about/page";

export default function Home() {
  return (
    <div className="w-full">
      <HomeContent />
      <AboutPage/>
      <Things/>
      <Works/>
      <PreviewMap />
    </div>
  );
}
