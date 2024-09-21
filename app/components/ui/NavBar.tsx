'use client';

import { Link, Navbar, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarBrand, Button } from "@nextui-org/react";
import { dmSerifText } from "../../shared/fonts";

interface NavBarProps {
    windowName: string;
    isMenuOpen: boolean;
    setIsMenuOpen: (isMenuOpen: boolean) => void;
}

export function NavBar(props: NavBarProps) {
    const menuItems = [
        "Explore apps",
        "Welcome",
        "Confirmation",
        "Assets",
        "Swap",
        "History",
        "Settings",
    ];

    return (<Navbar onMenuOpenChange={props.setIsMenuOpen} className={props.isMenuOpen ? 'bg-lightGreen' : 'bg-darkGreen'}>
        <NavbarContent>
            <NavbarMenuToggle
                aria-label={props.isMenuOpen ? "Close menu" : "Open menu"}
                className={`sm:hidden ${props.isMenuOpen ? 'text-darkGreen' : 'text-white'}`}
            />
            <NavbarBrand>
                <p className="font-bold text-inherit text-lightGreen">{props.windowName}</p>
            </NavbarBrand>
        </NavbarContent>

        <NavbarMenu className='bg-lightGreen'>

            {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                        color={"foreground"}
                        className={`w-full text-2xl mb-8 text-darkGreen ${dmSerifText.className} ${index === 0 ? 'mt-12 mb-20' : ''}`}
                        href={item === 'Welcome' ? '/' : `show${item}`}
                        size="lg"
                    >
                        {item}
                    </Link>
                </NavbarMenuItem>
            ))}
        </NavbarMenu>
    </Navbar>);
}