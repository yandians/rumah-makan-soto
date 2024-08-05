import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "@inertiajs/react";
import { Button } from "flowbite-react";

export default function Index({
    auth,
    makanans,
    totalMakanan,
    searchTerm: initialSearchTerm,
    pageTerm,
}) {
    const { data, setData, post, errors, processing, reset } = useForm({
        pesan: [
            { nama: "yusseno", produk_id: 1, jumlah: 10 }
        ],
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            post("/pesan")
        } catch (err) {
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setValidationErrors(newErrors);
            }
        }
    };
    console.log(errors.message)

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Produk
                </h2>
            }
        >
            <>Hallo</>
            <Button type="submit" onClick={handleSubmit} color="success">
                Simpan
            </Button>
        </AuthenticatedLayout>
    );
}
