import {
  FaFacebookSquare,
  FaGooglePlusSquare,
  FaLinkedin,
  FaTwitterSquare,
} from "react-icons/fa";
import { AiFillGoogleCircle, AiFillTwitterCircle } from "react-icons/ai";

function Footer() {
  return (
    <div className="bg-gradient-to-t from-top via-middle to-bottom text-white">
      <div className="grid grid-cols-3 gap-3 mx-auto w-11/12 pb-6 pt-56">
        <div>
          <p className="text-4xl font-dancing mb-4">Liquid Manga</p>
          <p className="my-2 text-sm">
            Read latest, updated manga at Liquid Manga
          </p>
          <p className="text-sm">
            08 Ha Van Tinh, Hoa Khanh Nam, Lien Chieu, Da Nang, Viet Nam
          </p>
        </div>
        <div className="flex justify-evenly">
          <div>
            <p className="uppercase mb-6">Infomation</p>
            <p className="text-sm mb-2">About Us</p>
            <p className="text-sm mb-2">More Search</p>
            <p className="text-sm mb-2">Events</p>
          </div>
          <div>
            <p className="uppercase mb-6">Legal</p>
            <p className="text-sm mb-2">Services</p>
            <p className="text-sm mb-2">Support</p>
            <p className="text-sm mb-2">Privacy</p>
          </div>
        </div>
        <div className="flex justify-center">
          <FaFacebookSquare className="text-white text-4xl" />
          <FaGooglePlusSquare className="text-white text-4xl ml-2" />
          <FaTwitterSquare className="text-white text-4xl ml-2" />
          <FaLinkedin className="text-white text-4xl ml-2" />
        </div>
      </div>
      <p className="text-center pb-7 text-sm">
        &copy; 2021 Liquid Manga. Alright Reserved
      </p>
    </div>
  );
}

export default Footer;
