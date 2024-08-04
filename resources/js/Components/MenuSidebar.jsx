import { Sidebar } from "flowbite-react";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    HiOutlineDocumentReport,
    HiOutlineShoppingCart,
    HiOutlineLogout,
    HiChartPie,
    HiUser,
} from "react-icons/hi";
import { GiExpense } from "react-icons/gi";
import { BiFoodMenu } from "react-icons/bi";
import logo from "../Assets/Logo Full Rumah Makan Soto.png";

const customTheme = {
    root: {
        base: "h-full",
        collapsed: {
            on: "w-16",
            off: "w-56 2xl:w-64",
        },
        inner: "h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 px-3 py-2 dark:bg-gray-800",
    },
    collapse: {
        button: "group flex w-[184px] 2xl:w-[200px] items-center rounded-lg p-2 mx-2 2xl:mx-4 text-sm 2xl:text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700",
        icon: {
            base: "text-lg xl:text-2xl text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            open: {
                off: "",
                on: "text-gray-900",
            },
        },
        label: {
            base: "ml-3 flex-1 whitespace-nowrap text-left",
            icon: {
                base: "text-lg xl:text-2xl6 transition delay-0 ease-in-out",
                open: {
                    on: "rotate-180",
                    off: "",
                },
            },
        },
        list: "space-y-1 py-1",
    },
    item: {
        icon: {
            base: "text-lg xl:text-2xl flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            active: "text-blue-700 dark:text-blue-100",
        },
        base: "flex items-center justify-center rounded-lg p-2 mx-2 2xl:mx-4 text-sm 2xl:text-base font-normal text-gray-900 cursor-pointer",
        active: "text-blue-700 dark:text-blue-100",
        collapsed: {
            insideCollapse: "group pl-8 transition duration-75",
            noIcon: "font-bold",
        },
    },
};

export default function MenuSidebar({ user, ...props }) {
    console.log("user", user);
    const useLocalStorage = (key, initialValue) => {
        const [storedValue, setStoredValue] = useState(() => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (error) {
                console.error(error);
                return initialValue;
            }
        });

        const setValue = (value) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error(error);
            }
        };

        return [storedValue, setValue];
    };

    const [isLaporanOpen, setIsLaporanOpen] = useLocalStorage(
        "isLaporanOpen",
        false
    );

    return (
        <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="fixed"
            theme={customTheme}
        >
            <div className="flex justify-center items-center w-full font-medium mb-2 mt-4">
                <a href="/">
                    <img src={logo} alt="Logo" className="" />
                </a>
            </div>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link
                        href="/dashboard"
                        method="get"
                        as="button"
                        type="button"
                        className="w-full"
                    >
                        <Sidebar.Item
                            icon={HiChartPie}
                            active={route().current("dashboard")}
                        >
                            <span className="flex items-center justify-between text-sm 2xl:text-base">
                                Dashboard
                            </span>
                        </Sidebar.Item>
                    </Link>

                    {user.level === "owner" ? (
                        <>
                            <Link
                                href="/produk"
                                method="get"
                                as="button"
                                type="button"
                                className="w-full"
                            >
                                <Sidebar.Item
                                    icon={BiFoodMenu}
                                    active={route().current("produk.index")}
                                >
                                    <span className="flex items-center justify-between text-sm 2xl:text-base">
                                        Makanan
                                    </span>
                                </Sidebar.Item>
                            </Link>

                            <Sidebar.Collapse
                                icon={HiOutlineDocumentReport}
                                label="Laporan"
                                open={isLaporanOpen}
                                onClick={() => setIsLaporanOpen(!isLaporanOpen)}
                            >
                                <Link
                                    href="/laporan/pendapatan"
                                    method="get"
                                    as="button"
                                    type="button"
                                    className="w-full"
                                >
                                    <Sidebar.Item
                                        active={route().current(
                                            "kasLaporanPendapatan.index"
                                        )}
                                    >
                                        Laporan Kas Masuk
                                    </Sidebar.Item>
                                </Link>
                                <Link
                                    href="/laporan/pengeluaran"
                                    method="get"
                                    as="button"
                                    type="button"
                                    className="w-full"
                                >
                                    <Sidebar.Item
                                        active={route().current(
                                            "kasLaporanPengeluaran.index"
                                        )}
                                    >
                                        Laporan Kas Keluar
                                    </Sidebar.Item>
                                </Link>
                                <Link
                                    href="/laporan/bukubesar"
                                    method="get"
                                    as="button"
                                    type="button"
                                    className="w-full"
                                >
                                    <Sidebar.Item
                                        active={route().current(
                                            "kasLaporanBukuBesar.index"
                                        )}
                                    >
                                        Laporan Buku Besar
                                    </Sidebar.Item>
                                </Link>
                            </Sidebar.Collapse>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/pendapatan"
                                method="get"
                                as="button"
                                type="button"
                                className="w-full"
                            >
                                <Sidebar.Item
                                    icon={HiOutlineShoppingCart}
                                    active={route().current(
                                        "kasPendapatan.index"
                                    )}
                                >
                                    <span className="flex items-center justify-between text-sm 2xl:text-base">
                                        Pendapatan
                                    </span>
                                </Sidebar.Item>
                            </Link>

                            <Link
                                href="/pengeluaran"
                                method="get"
                                as="button"
                                type="button"
                                className="w-full"
                            >
                                <Sidebar.Item
                                    icon={GiExpense}
                                    active={route().current(
                                        "kasPengeluaran.index"
                                    )}
                                >
                                    <span className="flex items-center justify-between text-sm 2xl:text-base">
                                        Pengeluaran
                                    </span>
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="absolute bottom-5 left-0 w-full px-3 py-4">
                    <Sidebar.Item href="#" icon={HiUser} className="cursor-auto">
                        {user.name}
                    </Sidebar.Item>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        type="button"
                        className="w-full"
                    >
                        <Sidebar.Item icon={HiOutlineLogout}>
                            <span className="flex items-center justify-between text-sm 2xl:text-base cursor-pointer">
                                Log Out
                            </span>
                        </Sidebar.Item>
                    </Link>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
