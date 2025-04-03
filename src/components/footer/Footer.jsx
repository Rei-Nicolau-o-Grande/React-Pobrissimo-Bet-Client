import { Footer } from "flowbite-react";

function myFooter() {

    const currentYear = new Date().getFullYear();

  return (
    <>
        <Footer container className="bg-slate-800">
            <Footer.Copyright href="#" by="Probissimo Bet™" year={currentYear} className="text-white" />
            <Footer.LinkGroup>
                <Footer.Link href="#" className="text-white">About</Footer.Link>
                <Footer.Link href="#" className="text-white">Privacy Policy</Footer.Link>
                <Footer.Link href="#" className="text-white">Licensing</Footer.Link>
                <Footer.Link href="#" className="text-white">Contact</Footer.Link>
            </Footer.LinkGroup>
        </Footer>
    </>
  );
}

export default myFooter;