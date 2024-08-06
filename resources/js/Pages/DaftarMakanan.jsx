import React, { useState, useEffect } from "react";
import { Button, Navbar, Card, Modal, Spinner, Badge } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import logo from "../Assets/Logo Full Rumah Makan Soto.png";
import { HiUser, HiShoppingBag } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "@inertiajs/inertia-react";
import { usePage } from '@inertiajs/react'
import { Inertia } from "@inertiajs/inertia";


const Pesanan = ({ orders, onOrder }) => {
    const totalHarga = orders.reduce(
        (total, order) => total + order.harga * order.jumlah,
        0
    );

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border border-gray-200 rounded shadow-lg p-4">
            <ul>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-100 flex justify-between"
                        >
                            <span>
                                {order.nama} x{order.jumlah}
                            </span>
                            <span>Rp {order.harga * order.jumlah}</span>
                        </li>
                    ))
                ) : (
                    <li className="p-2 text-gray-500">No orders yet</li>
                )}
            </ul>
            {orders.length > 0 && (
                <>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold">Rp {totalHarga}</span>
                    </div>
                    <Button
                        type="button"
                        className="mt-4 w-full"
                        onClick={onOrder}
                    >
                        Pesan Sekarang
                    </Button>
                </>
            )}
        </div>
    );
};

const FlashMessageModal = () => {
    const { props } = usePage();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        // Check if there's a message to display
        if (props.flash.message) {
            setModalMessage(props.flash.message);
            setShowModal(true);
        }
    }, [props.flash.message]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Modal show={showModal} onClose={handleCloseModal}>
                <Modal.Header>Notification</Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
            </Modal>
        </>
    );
};


export default function DaftarMakanan({ makanans, auth }) {
    const { flash } = usePage().props
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(""); // Message for modal
    const [searchTerm, setSearchTerm] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        orders: [],
    });

    const handleShoppingBagClick = () => {
        setShowOrders(!showOrders);
    };

    const handleAddToCart = (product) => {
        const existingOrderIndex = orders.findIndex(
            (order) => order.id === product.id
        );
        if (existingOrderIndex !== -1) {
            const updatedOrders = [...orders];
            updatedOrders[existingOrderIndex].jumlah += 1;
            setOrders(updatedOrders);
        } else {
            setOrders([...orders, { ...product, jumlah: 1 }]);
        }

        toast.success("Berhasil Menambahkan Pesanan!");
    };

    const [submitTrigger, setSubmitTrigger] = useState(false);

    useEffect(() => {
        if (submitTrigger) {
            post(route("pesan.store"), {
                onSuccess: (response) => {
                    toast.success("Pesanan berhasil disimpan!");
                    setModalMessage(response.message); // Set modal message
                    setShowModal(true); // Show the modal
                    reset(); // Clear form data after successful submission
                    setSubmitTrigger(false);
                },
                onError: (errors) => {
                    toast.error("Gagal menyimpan pesanan!");
                    console.error(errors);
                    setSubmitTrigger(false);
                },
            });
        }
    }, [submitTrigger]);

    const namaPembeli = auth.user.name

    console.log(namaPembeli)

    const handleOrder = (e) => {
        e.preventDefault();
        setData("pesan", orders.map((order) => ({
            produk_id: order.id,
            nama: namaPembeli,
            jumlah: order.jumlah,
        })));
        setSubmitTrigger(true);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            setOrders(orders.filter((order) => order.id !== productId));
        } else {
            const updatedOrders = orders.map((order) =>
                order.id === productId
                    ? { ...order, jumlah: newQuantity }
                    : order
            );
            setOrders(updatedOrders);
        }
    };

    const totalOrders = orders.reduce(
        (total, order) => total + order.jumlah,
        0
    );

    const userRole = auth.user ? auth.user.level : null;

    const handleLogout = () => {
        Inertia.post(route("logout"));
    };

    const handleClose = () => {
        setShowOrders(false);
    };

    const filteredMakanans = makanans.filter((makanan) =>
        makanan.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar
                fluid
                rounded
                className="fixed w-full top-0 left-0 right-0 z-50 bg-white shadow-md"
            >
                <Navbar.Brand href="/">
                    <img
                        src={logo}
                        className="mr-3 h-10 sm:h-14"
                        alt="Logo Rumah Makan Soto"
                    />
                </Navbar.Brand>
                <div className="flex md:order-2">
                    {auth.user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-black text-lg font-semibold text-opacity-80">
                                {auth.user.name}
                            </span>
                            <HiUser className="h-10 w-10 text-black text-opacity-60" />

                            <div>
                                <Button color="gray" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <a href="/login">
                            <Button>Login</Button>
                        </a>
                    )}
                </div>
            </Navbar>

            <div>
                {userRole === "pelanggan" && (
                    <div className="fixed bottom-4 2xl:bottom-10 right-4 2xl:right-10 z-50">
                        <div className="relative">
                            <HiShoppingBag
                                className="h-14 w-14 2xl:m-4 text-black text-opacity-60 cursor-pointer"
                                onClick={handleShoppingBagClick}
                            />
                            {totalOrders > 0 && (
                                <Badge className="absolute top-0 right-0 bg-red-600 text-white">
                                    {totalOrders}
                                </Badge>
                            )}
                            {showOrders && (
                                <div className="fixed inset-0 flex items-center justify-center z-50">
                                    <div
                                        className="absolute inset-0 2xl:mt-20 bg-gray-900 bg-opacity-90"
                                        onClick={handleClose}
                                    ></div>
                                    <Pesanan
                                        orders={orders}
                                        onOrder={handleOrder}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <ToastContainer />

            <section className="fixed w-full pt-24 bg-gray-100 pb-4 z-10">
                <div className="px-4 mx-auto max-w-screen-xl text-center">
                    <h3 className="text-4xl font-bold mb-6">Menu</h3>
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md py-2 border border-gray-300 rounded-lg mx-auto"
                    />
                </div>
            </section>

            {/* Produk Section */}
            <section className="pt-32 bg-gray-100 pb-20">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-10 mt-24">
                        {filteredMakanans.map((makanan) => {
                            const isInCart = orders.some(
                                (order) => order.id === makanan.id
                            );
                            const order = orders.find(
                                (order) => order.id === makanan.id
                            );
                            return (
                                <Card
                                    key={makanan.id}
                                    className={`bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out ${
                                        isInCart ? "bg-green-100" : ""
                                    }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="">
                                            <img
                                                src={makanan.image}
                                                alt={makanan.name}
                                                className="h-40 w-40 mb-4 p-4 rounded-t-lg"
                                            />
                                        </div>

                                        <h5 className="text-xl font-bold tracking-tight text-gray-900 text-center">
                                            {makanan.nama}
                                        </h5>
                                        <p className="text-base text-gray-600 mt-2 text-center">
                                            {makanan.deskripsi}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-700 mt-2">
                                            Rp {makanan.harga}
                                        </p>
                                        {userRole === "pelanggan" && (
                                            <div className="flex items-center mt-4">
                                                {isInCart ? (
                                                    <div className="flex items-center">
                                                        <Button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    makanan.id,
                                                                    (order.jumlah ||
                                                                        1) - 1
                                                                )
                                                            }
                                                            className="mr-2"
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="text-lg mx-4">
                                                            {order.jumlah}
                                                        </span>
                                                        <Button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    makanan.id,
                                                                    (order.jumlah ||
                                                                        1) + 1
                                                                )
                                                            }
                                                            className="ml-2"
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                makanan
                                                            )
                                                        }
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Order Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header className="bg-green-500 text-white">
                    Status Pesanan
                </Modal.Header>
                <Modal.Body className="text-center">
                    {processing ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Spinner aria-label="Loading" size="xl" className="mb-4" />
                            <p className="text-lg font-semibold">Memproses pesanan...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                            <HiCheckCircle className="h-12 w-12 text-green-500 mb-4" />
                            <p className="text-lg font-semibold">{modalMessage}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <FlashMessageModal />
        </>
    );
}