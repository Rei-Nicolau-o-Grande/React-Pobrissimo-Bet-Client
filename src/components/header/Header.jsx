import { Navbar, Button } from "flowbite-react";
import { NavLink } from "react-router-dom";
import FormLoginUser from "../form-login-user/form-login-user.jsx";
import FormCreateUser from "../form-create-user/form-create-user.jsx";


function Header() {
    return (
        <>
            <Navbar fluid rounded className={"bg-slate-800"}>
                <NavLink to={"/"}>
                    <Navbar.Brand as={"div"}>
                        <img src={"src/assets/img/roleta_da_picanha.jpeg"} className="mr-3 h-6 sm:h-9" alt="Probissimo Bet Logo" />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-white">
                            Probissimo Bet
                        </span>
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Button color={"light"} className={"my-3"} pill>
                        <NavLink to={"/user"}>Perfil</NavLink>
                    </Button>
                    <Button color={"failure"} className={"my-3"} pill>Sair</Button>
                    <FormLoginUser />
                    <FormCreateUser />
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default Header;