import Link from "next/link";
import LogoIcon from "./icons/logo";
import { FaTelegram, FaTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <div className="flex items-center gap-4 justify-center pb-6">
      <LogoIcon size={60} />
      <Link href="https://twitter.com/solstatz" target="_blank">
        <FaTwitter size={20} />
      </Link>
      <Link href="https://t.me/solstatz" target="_blank">
        <FaTelegram size={20} />
      </Link>
    </div>
  );
};
