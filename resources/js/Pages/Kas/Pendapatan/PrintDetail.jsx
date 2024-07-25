import React, { useState, useEffect, useRef, forwardRef, useMemo  } from "react";
import moment from "moment";

function formatRupiah(angka) {
    var formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    return formatter.format(angka);
}

const PrintDetail = React.forwardRef(({ data }, ref) => {
    const totalPembayaran = useMemo(() => {
        return data.produks.reduce((total, produk) => {
            const hargaProduk = produk.harga
                ? produk.harga
                : produk.produk.harga * produk.jumlah;
            return total + hargaProduk;
        }, 0);
    }, [data.produks]);
    return (
        <>
            <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
                <div className="space-y-3">
                    <div>
                        <table className=" border-collapse">
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2">Kode</td>
                                    <td className="px-4 py-2">:</td>
                                    <td className="px-4 py-2">PSP24001</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Tanggal</td>
                                    <td className="px-4 py-2">:</td>
                                    <td className="px-4 py-2">
                                        {moment(data.updated_at)
                                            .locale("id")
                                            .format("DD/MM/YYYY HH:mm")}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Metode</td>
                                    <td className="px-4 py-2">:</td>
                                    <td className="px-4 py-2">
                                        {data.metode_pembayaran}
                                    </td>
                                </tr>
                                
                            </tbody>

                        </table>
                        <table className="mt-5 border-collapse border border-gray-200">
                            <tbody>
                                {data.produks.map((produk, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            {produk.jumlah} *{" "}
                                            {produk.produk.harga}
                                            <br />
                                            {produk.nama
                                                ? produk.nama
                                                : produk.produk.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 align-top">
                                            {formatRupiah(
                                                produk.harga
                                                    ? produk.harga
                                                    : produk.produk.harga *
                                                          produk.jumlah
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan="1"
                                        className="px-6 py-3 text-left text-gray-900 uppercase tracking-wider"
                                    >
                                        Total
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-left">
                                        {formatRupiah(totalPembayaran)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
});

export default PrintDetail;
