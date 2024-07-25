import React, { useState, useEffect, useRef, forwardRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useReactToPrint } from "react-to-print";
import { Inertia } from "@inertiajs/inertia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    TextInput,
    Badge,
    Button,
} from "flowbite-react";
import { HiPrinter } from "react-icons/hi";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
registerLocale("id", id);
setDefaultLocale("id");

import PrintLaporanPengeluaran from "./PrintLaporanPengeluaran";

export default function IndexLaporanPengeluaran({
    auth,
    kasKeluar,
    startDate: initialStartDate,
    endDate: initialEndDate,
}) {
    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);
    const onChange = (dates) => {
        const [start, end] = dates;
        setState([{ startDate: start, endDate: end, key: "selection" }]);
    };
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
        const renderedValues = () => {
            const [start, end] = value.split(" - ");
            if (!end || start === end) {
                return start;
            }
            return `${start} - ${end}`;
        };
        return (
            <TextInput
                type="text"
                onClick={onClick}
                ref={ref}
                placeholder="Pilih tanggal..."
                value={renderedValues()}
                readOnly
            />
        );
    });

    const handleReset = () => {
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);
        Inertia.get(route("kasLaporanPengeluaran.index"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;
        const endDate = state[0].endDate
            ? format(state[0].endDate, "yyyy-MM-dd")
            : state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;

        const filterParams = {
            startDate,
            endDate,
        };

        Inertia.get(route("kasLaporanPengeluaran.index"), filterParams);
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Laporan Pengeluaran
                </h2>
            }
        >
            <div>
                <ToastContainer />
            </div>

            <Head title="Laporan Pengeluaran" />

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-10 pt-10 pb-5 2xl:pb-10 text-gray-900 text-[28px] 2xl:text-4xl font-medium">
                            LAPORAN PENGELUARAN
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="mx-10">
                                <form onSubmit={handleSubmit} className="">
                                    <div className="flex items-center">
                                        <div className="ml-2">
                                            <DatePicker
                                                selected={state[0].startDate}
                                                onChange={onChange}
                                                startDate={state[0].startDate}
                                                endDate={state[0].endDate}
                                                selectsRange
                                                customInput={
                                                    <ExampleCustomInput />
                                                }
                                                dateFormat="dd MMMM yyyy"
                                            />
                                        </div>
                                        <div className="flex">
                                            <Button
                                                color="failure"
                                                onClick={handleReset}
                                                type="reset"
                                                className="ml-2"
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                className="ml-2"
                                                color="success"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="mr-10">
                                <Button className="ml-2" onClick={handlePrint}>
                                    <HiPrinter className="mr-2 text-xl" />
                                    Print
                                </Button>
                            </div>
                        </div>
                        <PrintLaporanPengeluaran
                            ref={componentRef}
                            kasKeluar={kasKeluar}
                            date={state}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
