import React, { useState, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import logo from "../../Assets/Logo Full Rumah Makan Soto.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerSchema from "./RegisterShema";



export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const [validationErrors, setValidationErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const submit = async (e) => {
        e.preventDefault();
        try {
            await registerSchema.validate(data, { abortEarly: false })
            console.log(data)
            post(route('register'));
            setValidationErrors({});
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
        // <GuestLayout>
        //     <Head title="Register" />

        //     <form onSubmit={submit}>
        //         <div>
        //             <InputLabel htmlFor="name" value="Name" />

        //             <TextInput
        //                 id="name"
        //                 name="name"
        //                 value={data.name}
        //                 className="mt-1 block w-full"
        //                 autoComplete="name"
        //                 isFocused={true}
        //                 onChange={(e) => setData('name', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.name} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="email" value="Email" />

        //             <TextInput
        //                 id="email"
        //                 type="email"
        //                 name="email"
        //                 value={data.email}
        //                 className="mt-1 block w-full"
        //                 autoComplete="username"
        //                 onChange={(e) => setData('email', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.email} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="password" value="Password" />

        //             <TextInput
        //                 id="password"
        //                 type="password"
        //                 name="password"
        //                 value={data.password}
        //                 className="mt-1 block w-full"
        //                 autoComplete="new-password"
        //                 onChange={(e) => setData('password', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.password} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

        //             <TextInput
        //                 id="password_confirmation"
        //                 type="password"
        //                 name="password_confirmation"
        //                 value={data.password_confirmation}
        //                 className="mt-1 block w-full"
        //                 autoComplete="new-password"
        //                 onChange={(e) => setData('password_confirmation', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.password_confirmation} className="mt-2" />
        //         </div>

        //         <div className="flex items-center justify-end mt-4">
        //             <Link
        //                 href={route('login')}
        //                 className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        //             >
        //                 Already registered?
        //             </Link>

        //             <PrimaryButton className="ms-4" disabled={processing}>
        //                 Register
        //             </PrimaryButton>
        //         </div>
        //     </form>
        // </GuestLayout>
        <>
            <Head title="Register" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div className="flex justify-center items-center">
                                <img className="" src={logo} alt="logo" />
                            </div>

                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={submit}
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Nama
                                    </label>
                                    <TextInput
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={
                                            validationErrors.name ||
                                            errors.name
                                                ? "border border-red-600 focus:ring-red-600 focus:border-red-600"
                                                : "border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                        }
                                    />
                                    {(validationErrors.name ||
                                        errors.name) && (
                                        <div className="text-red-500 text-xs italic">
                                            {validationErrors.name ||
                                                errors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Username
                                    </label>
                                    <TextInput
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className={
                                            validationErrors.username ||
                                            errors.username
                                                ? "border border-red-600 focus:ring-red-600 focus:border-red-600"
                                                : "border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                        }
                                    />
                                    {(validationErrors.username ||
                                        errors.username) && (
                                        <div className="text-red-500 text-xs italic">
                                            {validationErrors.username ||
                                                errors.username}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Email
                                    </label>
                                    <TextInput
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={
                                            validationErrors.email ||
                                            errors.email
                                                ? "border border-red-600 focus:ring-red-600 focus:border-red-600"
                                                : "border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                        }
                                    />
                                    {(validationErrors.email ||
                                        errors.email) && (
                                        <div className="text-red-500 text-xs italic">
                                            {validationErrors.email ||
                                                errors.email}
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
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                validationErrors.password ||
                                                errors.password
                                                    ? "border border-red-600 focus:ring-red-600 focus:border-red-600"
                                                    : "border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
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
                                    {(validationErrors.password ||
                                        errors.password) && (
                                        <div className="text-red-500 text-xs italic">
                                            {validationErrors.password ||
                                                errors.password}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                validationErrors.password_confirmation ||
                                                errors.password_confirmation
                                                    ? "border border-red-600 focus:ring-red-600 focus:border-red-600"
                                                    : "border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
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
                                    {(validationErrors.password_confirmation ||
                                        errors.password_confirmation) && (
                                        <div className="text-red-500 text-xs italic">
                                            {validationErrors.password_confirmation ||
                                                errors.password_confirmation}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-5">
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Register
                                    </button>
                                </div>
                                <div>
                                    Sudah Punya akun?{" "}
                                    <Link
                                        href={route("login")}
                                        className="text-blue-600"
                                    >
                                        Login Sekarang
                                    </Link>
                                </div>{" "}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
