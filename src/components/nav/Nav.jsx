import { Sidebar } from "flowbite-react";
import { NavLink } from "react-router-dom";

function Nav() {
    return (
        <Sidebar aria-label="Sidebar with multi-level dropdown example" className="py-3 px-3">
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item as="div">
                        <NavLink
                            to="/game/roda-roda-picanha"
                            className={({ isActive }) =>
                                isActive ? "text-black bg-gray-200 rounded-full" : "text-gray-900"
                            }
                        >
                            Roda Roda Picanha 🥩
                        </NavLink>
                    </Sidebar.Item>
                    <Sidebar.Item as="div">
                        <NavLink
                            to="/game/burrinho"
                            className={({ isActive }) =>
                                isActive ? "text-black bg-gray-200 rounded-full" : "text-gray-900"
                            }
                        >
                            Burrinho Fortune 🫏
                        </NavLink>
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default Nav;
