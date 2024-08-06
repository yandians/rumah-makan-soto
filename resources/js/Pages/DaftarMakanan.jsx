import { useState } from "react";
import { Button, Navbar, Card, Modal, Spinner, Badge } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import logo from "../Assets/Logo Full Rumah Makan Soto.png";
import { HiUser, HiShoppingBag } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inertia } from "@inertiajs/inertia";

const Pesanan = ({ orders, onOrder, orderStatus }) => {
    const totalHarga = orders.reduce(
        (total, order) => total + order.harga * order.jumlah,
        0
    );

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg p-4">
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
                    {!orderStatus && (
                        <Button className="mt-4 w-full" onClick={onOrder}>
                            Pesan Sekarang
                        </Button>
                    )}
                    {orderStatus && (
                        <div className="mt-4 p-2 border-t border-gray-200">
                            <p className="text-center font-semibold">
                                {orderStatus}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default function DaftarMakanan({ makanans, auth }) {
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);

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

    const handleOrder = () => {
        setIsLoading(true);
        setShowModal(true);
        setOrderStatus("Pesanan sedang diproses");
        setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }, 2000);
    };

    const totalOrders = orders.reduce(
        (total, order) => total + order.jumlah,
        0
    );

    const userRole = auth.user ? auth.user.level : null;

    const handleLogout = () => {
        Inertia.post(route("logout"));
    };

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
                            {userRole === "pelanggan" && (
                                <div className="relative">
                                    <HiShoppingBag
                                        className="h-10 w-10 text-black text-opacity-60 cursor-pointer"
                                        onClick={handleShoppingBagClick}
                                    />
                                    {totalOrders > 0 && (
                                        <Badge className="absolute top-0 right-0 bg-red-600 text-white">
                                            {totalOrders}
                                        </Badge>
                                    )}
                                    {showOrders && (
                                        <Pesanan
                                            orders={orders}
                                            onOrder={handleOrder}
                                            orderStatus={orderStatus}
                                        />
                                    )}
                                </div>
                            )}
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

            <ToastContainer />

            {/* Produk Section */}
            <section className="pt-10 bg-gray-100 pb-20">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <h3 className="text-4xl font-bold text-center mb-6">
                        Menu
                    </h3>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-10">
                        {makanans.map((makanan) => (
                            <Card
                                key={makanan.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
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
                                        <Button
                                            onClick={() =>
                                                handleAddToCart(makanan)
                                            }
                                            className="mt-4"
                                        >
                                            Add to Cart
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Order Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header className="bg-green-500 text-white">
                    Status Pesanan
                </Modal.Header>
                <Modal.Body className="text-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Spinner
                                aria-label="Loading"
                                size="xl"
                                className="mb-4"
                            />
                            <p className="text-lg font-semibold">
                                Memproses pesanan...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                            <HiCheckCircle className="h-12 w-12 text-green-500 mb-4" />
                            <p className="text-lg font-semibold">
                                Silahkan tunggu pesanan anda
                            </p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}
