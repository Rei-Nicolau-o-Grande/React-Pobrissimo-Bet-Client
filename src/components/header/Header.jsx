import { Navbar, Button, NavbarLink } from "flowbite-react";
import { HiUserCircle, HiLogout } from "react-icons/hi";
import {Link, NavLink, useNavigate} from "react-router-dom";
import FormLoginUser from "../form-login-user/form-login-user.jsx";
import FormCreateUser from "../form-create-user/form-create-user.jsx";
import { useCookies } from "react-cookie";
import WalletModal from "../wallet-modal/wallet-modal.jsx";
import { jwtDecode } from "jwt-decode";
import roletaPicanha from "../../assets/img/roleta_da_picanha.jpeg"

function Header() {

    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (confirm("Você deseja sair?")) {
            removeCookie("accessToken");
            navigate("/");
        }
    };

    const isAuthenticated = !!cookies.accessToken;
    let decodedToken = null;
    if (isAuthenticated) {
        try {
            decodedToken = jwtDecode(cookies.accessToken);
        } catch (error) { /* empty */ }
    }

    return (
        <>
            <Navbar fluid className={"bg-slate-800"}>
                <NavLink to={"/"}>
                    <Navbar.Brand as={"div"}>
                        <img src={roletaPicanha} className="mr-3 h-6 sm:h-9"
                             alt="Probissimo Bet Logo"/>
                        <span
                            className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-white">
                            Probissimo Bet
                        </span>
                    </Navbar.Brand>
                </NavLink>
                <div className="flex ml-auto mx-5">
                    {isAuthenticated && decodedToken ? (
                        decodedToken.roles.includes('Player') ? (
                            <WalletModal/>
                        ) : null
                    ) : null}
                </div>
                <Navbar.Toggle/>
                <Navbar.Collapse className={'mr-16'}>
                    {isAuthenticated && decodedToken ? (
                        <>
                            {decodedToken.roles.includes('Player') && (
                                <>
                                    <NavbarLink as={Link} to="/user">
                                        <span
                                            className={`text-white hover:cursor-pointer hover:text-gray-500`}
                                        >
                                            Perfil
                                        </span>
                                    </NavbarLink>
                                    <NavbarLink
                                        onClick={handleLogout}
                                    >
                                        <span
                                            className={`text-white hover:cursor-pointer hover:text-gray-500`}
                                        >
                                            Sair
                                        </span>
                                    </NavbarLink>
                                </>
                            )}
                            {decodedToken.roles.includes('Admin') && (
                                <>
                                    <NavbarLink as={Link} to="/admin">
                                        <Button color={'light'} className={'my-3 w-full'} pill>
                                            <HiUserCircle className={'mr-2 h-5 w-5'}/>
                                            Admin
                                        </Button>
                                    </NavbarLink>
                                    <Button color={'failure'} className={'my-3'} pill onClick={handleLogout}>
                                        Sair
                                        <HiLogout className={'ml-2 h-5 w-5'}/>
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <FormLoginUser/>
                            <FormCreateUser/>
                        </>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default Header;