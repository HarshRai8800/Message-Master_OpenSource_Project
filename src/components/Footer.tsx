import Link from "next/link";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 flex justify-center items-center  h-40 text-white py-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6">
          <Link href="https://www.linkedin.com/in/harsh-rai-55766bjk65/" aria-label="LinkedIn">
            <FaLinkedin className="text-2xl hover:text-blue-500" />
          </Link>
          <Link href="https://github.com/HarshRai8800" aria-label="GitHub">
            <FaGithub className="text-2xl hover:text-gray-400" />
          </Link>
          <Link href="/" aria-label="Twitter">
            <FaTwitter className="text-2xl hover:text-blue-400" />
          </Link>
        </div>
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;