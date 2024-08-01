import { useState, useEffect } from "react";
import MenuSidebar from "@/Components/MenuSidebar";

export default function Authenticated({ user, children }) {
    const [isMobileResolution, setIsMobileResolution] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileResolution(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {!isMobileResolution ? (
                <>
                    <div className="w-56 2xl:w-64 bg-white shadow-md text-sm 2xl:text-base">
                        <MenuSidebar user={user} />
                    </div>
                    <main className="flex-1">{children}</main>
                </>
            ) : (
                <>
                    <main className="flex-1">{children}</main>
                </>
            )}
        </div>
    );
}
