import {Avatar, Tooltip} from "flowbite-react";
import {NavLink} from "react-router-dom";
import roletaPicanha from "../../assets/img/roleta_da_picanha.jpeg"
import burrinho from "../../assets/img/burrinho.jpeg"

function NavMobile() {
    return (
        <>
            <div className="py-5 px-3">
                <Tooltip content="Roleta da picanha 🥩">
                    <NavLink to={"/game/roda-roda-picanha"}>
                        <Avatar img={roletaPicanha} placeholderInitials="" rounded
                                className={"w-20"}/>
                    </NavLink>
                </Tooltip>
            </div>
            <div className={`py-5 px-3`}>
                <Tooltip content="Burrinho 🫏">
                    <NavLink to={"/game/burrinho-fortune"}>
                        <Avatar img={burrinho} placeholderInitials="" rounded
                                className={"w-20"}/>
                    </NavLink>
                </Tooltip>
            </div>
        </>
    )
}

export default NavMobile;