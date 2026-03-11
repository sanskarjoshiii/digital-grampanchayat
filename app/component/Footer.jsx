import Link from "next/link";

const Footer = () => {
  return (
    <div className="container">
      <footer className="py-3 my-4">
        <ul className="flex flex-row justify-center">
          <li className="nav-item">
            <Link href="/" className="nav-link px-2 text-body-secondary">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about" className="nav-link px-2 text-body-secondary">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/documents" className="nav-link px-2 text-body-secondary">
              Documents
            </Link>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-body-secondary">
              FAQs
            </a>
          </li>
          
        </ul>
        <p className="text-center text-body-secondary py-4 "><span className="border-b-2 border-black"> 2024 Company Inc</span></p>
      </footer>
    </div>
  );
};
export default Footer;
