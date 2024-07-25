import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Card } from "flowbite-react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";

export default function Dashboard({
    auth,
    totalUangKeluarHariIni,
    totalUangKeluarMingguIni,
    totalUangKeluarBulanIni,
    totalKasMasukHariIni,
    totalKasMasukMingguIni,
    totalKasMasukBulanIni,
}) {
    const data = {
        today: {
            label: "Hari Ini",
            labaRugi: totalKasMasukHariIni - totalUangKeluarHariIni,
            pemasukan: totalKasMasukHariIni,
            pengeluaran: totalUangKeluarHariIni,
        },
        thisWeek: {
            label: "Minggu Ini",
            labaRugi: totalKasMasukMingguIni - totalUangKeluarMingguIni,
            pemasukan: totalKasMasukMingguIni,
            pengeluaran: totalUangKeluarMingguIni,
        },
        thisMonth: {
            label: "Bulan Ini",
            labaRugi: totalKasMasukBulanIni - totalUangKeluarBulanIni,
            pemasukan: totalKasMasukBulanIni,
            pengeluaran: totalUangKeluarBulanIni,
        },
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const userLevel = auth.user.level;
    const periodsToShow = userLevel === "owner" ? ["today", "thisWeek", "thisMonth"] : ["today"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-10 grid grid-cols-1 gap-6">
                            {periodsToShow.map((periodKey) => {
                                const period = data[periodKey];
                                return (
                                    <div key={periodKey}>
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                                            {period.label}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <Card>
                                                <div className="flex items-center">
                                                    <RiMoneyDollarCircleLine className="text-4xl mr-4 text-gray-600" />
                                                    <div>
                                                        <h5 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">
                                                            Laba - Rugi
                                                        </h5>
                                                        <p className="font-normal text-gray-600 dark:text-gray-400">
                                                            {formatRupiah(period.labaRugi)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                            <Card className="mt-4 sm:mt-0">
                                                <div className="flex items-center">
                                                    <GiReceiveMoney className="text-4xl mr-4 text-gray-600" />
                                                    <div>
                                                        <h5 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">
                                                            Pemasukan
                                                        </h5>
                                                        <p className="font-normal text-gray-600 dark:text-gray-400">
                                                            {formatRupiah(period.pemasukan)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                            <Card className="mt-4 sm:mt-0">
                                                <div className="flex items-center">
                                                    <GiPayMoney className="text-4xl mr-4 text-gray-600" />
                                                    <div>
                                                        <h5 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">
                                                            Pengeluaran
                                                        </h5>
                                                        <p className="font-normal text-gray-600 dark:text-gray-400">
                                                            {formatRupiah(period.pengeluaran)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
