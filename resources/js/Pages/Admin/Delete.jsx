import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Inertia } from "@inertiajs/inertia";

export default function Delete({ show, onClose, idUser }) {
    const { data, setData, put, errors, processing, reset } = useForm({
        name: "",
        username: "",
        email: "",
        level: "",
        password: "",
        confirmPassword: "",
    });

    const [user, setUser] = useState(null);
    useEffect(() => {
        if (idUser) {
            axios
                .get(`/admin/${idUser}`)
                .then((response) => {
                    const UserData = response.data;
                    setUser(UserData);

                    setData((prevData) => ({
                        ...prevData,
                        name: UserData.name,
                        username: UserData.username,
                        email: UserData.email,
                        level: UserData.level,
                    }));
                })
                .catch((error) => {
                    console.error("Error fetching produk:", error);
                });
        }
    }, [idUser]);

    const handleDelete = (idUser) => {
        Inertia.delete(route("admin.destroy", idUser));
    };

    return (
        <>
            <Modal show={show} onClose={onClose} size="md" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin menghapus user {data.name}{" "}
                            ?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={() => handleDelete(idUser)}
                            >
                                Yakin
                            </Button>
                            <Button color="gray" onClick={onClose}>
                                Tidak
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
