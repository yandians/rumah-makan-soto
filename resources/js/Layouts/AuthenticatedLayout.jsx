import { useState } from "react";
import MenuSidebar from "@/Components/MenuSidebar";

export default function Authenticated({ user, children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-56 2xl:w-64 bg-white shadow-md text-sm 2xl:text-base">
                    <MenuSidebar user={user} />
            </div>
            <main className="flex-1">{children}</main>
        </div>
    );
}
