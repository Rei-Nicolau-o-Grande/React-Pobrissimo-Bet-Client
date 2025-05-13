import Header from "../../../components/header/Header.jsx";
import Nav from "../../../components/nav/Nav.jsx";
import NavMobile from "../../../components/mobile/nav-mobile.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import { GameBurrinho } from "./components/Game-Burrinho.jsx";
import { TableResultGameBurrinhoFortune } from "./components/table-result-game-burrinho-fortune.jsx";

export function Burrinho() {
    return (
        <>
            <header>
                <Header/>
            </header>

            <div className="grid grid-cols-12">
                <nav className="col-span-2 hidden 2xl:block py-3 px-3">
                    <Nav/>
                </nav>

                <div className="col-span-12 block 2xl:hidden py-3 px-3">
                    <div className="overflow-x-auto flex flex-row">
                        <NavMobile/>
                    </div>
                </div>

                <section className="col-span-12 md:col-span-8 py-3 px-3">
                    <h1 className={`text-4xl text-center`}>Burrinho Fortune 🫏</h1>
                    <GameBurrinho />
                    <TableResultGameBurrinhoFortune />
                </section>
            </div>

            <footer>
                <Footer />
            </footer>
        </>
    );
}