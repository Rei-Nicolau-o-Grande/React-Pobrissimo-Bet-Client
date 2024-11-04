import { Avatar, Tooltip } from "flowbite-react";
import {Link, NavLink, useNavigate} from "react-router-dom";


function NavMobile() {
    return (
        <>
            <div className="py-5 px-3">
                <Tooltip content="Roleta da picanha 🥩">
                    <NavLink to={"/game/roleta-da-picanha"}>
                        <Avatar img={"/src/assets/img/roleta_da_picanha.jpeg"} placeholderInitials="" rounded
                                className={"w-20"}/>
                    </NavLink>
                </Tooltip>
            </div>
            <div className={`py-5 px-3`}>
                <Tooltip content="Burrinho 🫏">
                    <NavLink to={"/game/burrinho"}>
                        <Avatar img={"/src/assets/img/burrinho.jpeg"} placeholderInitials="" rounded
                                className={"w-20"}/>
                    </NavLink>
                </Tooltip>
            </div>
        </>
    )
}

export default NavMobile;