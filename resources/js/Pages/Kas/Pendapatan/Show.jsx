import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useForm } from "@inertiajs/react";
import Select from "react-select";
import KasPendapatanSchema from "./KasPendapatanSchema";
import axios from "axios";
import moment from "moment";
import PrintDetail from "./PrintDetail";
import { useReactToPrint } from "react-to-print";
import { HiPrinter } from "react-icons/hi";


export default function Show({ show, onClose, idKasMasuk }) {
    const { data, setData, put, errors, reset } = useForm({
        kode: "",
        makanans: [], // Pastikan produks diinisialisasi dengan array kosong
        status: "",
    });

    const [kasMasuk, setKasMasuk] = useState(null);

    useEffect(() => {
        if (idKasMasuk) {
            axios
                .get(`/pendapatan/${idKasMasuk}`)
                .then((response) => {
                    const kasMasukData = response.data;
                    setKasMasuk(kasMasukData);

                    // Update data dengan nilai dari kasMasukData
                    setData({
                        ...data,
                        kode: kasMasukData.kode,
                        makanans: kasMasukData.kas_masuk_makanan || [], // Pastikan produks tidak undefined
                        status: kasMasukData.status,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idKasMasuk]); // Tambahkan idKasMasuk ke dependencies

    
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            <Modal show={show} onClose={onClose} size="4xl">
                <Modal.Header>Detail Pendapatan</Modal.Header>
                <Modal.Body>
                    <PrintDetail ref={componentRef} data={data} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="mr-10">
                        <Button className="ml-2" onClick={handlePrint}>
                            <HiPrinter className="mr-2 text-xl" />
                            Print
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
