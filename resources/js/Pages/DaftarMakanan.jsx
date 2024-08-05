import { useState } from "react";
import { Button, Navbar, Card, Modal } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import logo from "../Assets/Logo Full Rumah Makan Soto.png";
import { HiUser, HiShoppingBag } from "react-icons/hi";

const Pesanan = ({ orders, onOrder }) => {
    const totalHarga = orders.reduce((total, order) => total + order.harga, 0);

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg p-4">
            <ul>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <li key={index} className="p-2 hover:bg-gray-100 flex justify-between">
                            <span>{order.nama}</span>
                            <span>Rp {order.harga}</span>
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
                    <Button className="mt-4 w-full" onClick={onOrder}>
                        Pesan Sekarang
                    </Button>
                </>
            )}
        </div>
    );
};

export default function DaftarMakanan({ makanans, auth }) {
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    console.log(makanans)

    const handleShoppingBagClick = () => {
        setShowOrders(!showOrders);
    };

    const handleAddToCart = (product) => {
        setOrders([...orders, product]);
    };

    const handleOrder = () => {
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 5000);
    };

    const userRole = auth.user ? auth.user.level : null;

    return (
        <>
            <Navbar fluid rounded>
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
                            <span className="text-black text-lg font-semibold text-opacity-80">{auth.user.name}</span>
                            <HiUser className="h-10 w-10 text-black text-opacity-60" />
                            {userRole === 'pelanggan' && (
                                <div className="relative">
                                    <HiShoppingBag
                                        className="h-10 w-10 text-black text-opacity-60 cursor-pointer"
                                        onClick={handleShoppingBagClick}
                                    />
                                    {showOrders && <Pesanan orders={orders} onOrder={handleOrder} />}
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href="/login">
                            <Button>Login</Button>
                        </a>
                    )}
                </div>
            </Navbar>

            {/* Produk Section */}
            <section className="pt-10 bg-gray-100 pb-20">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <h3 className="text-4xl font-bold text-center mb-6">
                        Menu
                    </h3>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-10">
                        {makanans.map((makanan) => (
                            <Card key={makanan.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={makanan.image}
                                        alt={makanan.name}
                                        className="w-full h-48 object-cover mb-4 rounded-t-lg"
                                    />
                                    <h5 className="text-xl font-bold tracking-tight text-gray-900 text-center">
                                        {makanan.nama}
                                    </h5>
                                    <p className="text-lg font-semibold text-gray-700 mt-2">
                                        Rp {makanan.harga}
                                    </p>
                                    {userRole === 'pelanggan' && (
                                        <Button onClick={() => handleAddToCart(makanan)} className="mt-4">
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
                    Pesanan Berhasil
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div className="flex flex-col items-center justify-center py-4">
                        <HiCheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <p className="text-lg font-semibold">
                            Silahkan tunggu pesanan anda
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
