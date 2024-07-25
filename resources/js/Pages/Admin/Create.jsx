import { Button, Modal, TextInput, Label, Select } from "flowbite-react";
import { useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import UserSchema from "./UserSchema";

const customTheme = {
    field: {
        input: {
            colors: {
                gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
                failure:
                    "border-red-500 bg-gray-50 text-gray-900 placeholder-gray-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
            },
        },
    },
};

export default function Create() {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        username: "",
        email: "",
        level: "",
        password: "",
        confirmPassword: ""
    });

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const handleToggleModal = () => {
        setOpenModalCreate(!openModalCreate);
    };

    const [validationErrors, setValidationErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [showPassword1, setShowPassword1] = useState(false);
    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleReset = () => {
        reset();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await UserSchema.validate(data, { abortEarly: false });
               post("/admin",
                    {
                        onSuccess: () => {
                            reset();
                            setOpenModalCreate();
                        },
                    }
                );
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

    return (
        <>
            <Button
                color="blue"
                className="text-end mx-10"
                size="sm"
                onClick={handleToggleModal}
            >
                <HiOutlinePlusSm className="text-xl mr-2" /> Tambah User
            </Button>
            <Modal
                show={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
            >
                <Modal.Header>Tambah User</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nama" value="Nama" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="name"
                                placeholder="Nama"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                value={data.name}
                                required
                                color={
                                    validationErrors.name || errors.name
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.name || errors.name) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.name || errors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="username" value="Username" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="username"
                                placeholder="username"
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                value={data.username}
                                required
                                color={
                                    validationErrors.username || errors.username
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.username || errors.username) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.username ||
                                        errors.username}
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Email" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="email"
                                type="email"
                                placeholder="example@example.com"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                value={data.email}
                                required
                                color={
                                    validationErrors.email || errors.email
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.email || errors.email) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.email || errors.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="level" value="Level" />
                            </div>
                            <Select
                                id="level"
                                onChange={(e) =>
                                    setData("level", e.target.value)
                                }
                                value={data.level}
                                required
                            >
                                <option>Pilih level</option>
                                <option value="owner">Owner</option>
                                <option value="pegawai">Pegawai</option>
                            </Select>
                            {(validationErrors.level || errors.level) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.level || errors.level}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <TextInput
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 text-xl ${
                                                validationErrors.email"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible />
                                    ) : (
                                        <AiOutlineEye />
                                    )}
                                </span>
                            </div>
                            {(validationErrors.password || errors.password) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.password ||
                                        errors.password}
                                </div>
                            )}
                        </div>

                        <div>
                        <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Konfirmasi Password
                            </label>

                            <div className="relative">
                                <TextInput
                                    type={showPassword1 ? "text" : "password"}
                                    value={data.confirmPassword}
                                    onChange={(e) =>
                                        setData("confirmPassword", e.target.value)
                                    }
                                />
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 text-xl ${
                                                validationErrors.email"
                                    onClick={togglePasswordVisibility1}
                                >
                                    {showPassword1 ? (
                                        <AiOutlineEyeInvisible />
                                    ) : (
                                        <AiOutlineEye />
                                    )}
                                </span>
                            </div>
                            {(validationErrors.confirmPassword || errors.confirmPassword) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.confirmPassword ||
                                        errors.confirmPassword}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end w-full">
                            <Button
                                onClick={handleReset}
                                color="failure"
                                className="mr-2"
                            >
                                Reset
                            </Button>
                            <Button onClick={handleSubmit} color="success">
                                Simpan
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
