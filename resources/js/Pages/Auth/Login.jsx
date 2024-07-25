import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import userSchema from "./UserSchema";
import TextInput from "@/Components/TextInput";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../Assets/Logo Full Rumah Makan Soto.png"

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        login: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    useEffect(() => {
        return () => {
            reset("errors"); // Reset errors saat komponen dilepas
        };
    }, []);

    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userSchema.validate(data, { abortEarly: false });
            await post(route("login"));
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
        <>
            <Head title="Log in" />

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
                                <img
                                    className=""
                                    src={logo}
                                    alt="logo"
                                />
                            </div>

                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label
                                        htmlFor="login"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Username / Email
                                    </label>
                                    <TextInput
                                        value={data.login}
                                        onChange={(e) =>
                                            setData("login", e.target.value)
                                        }
                                        className={
                                            validationErrors.login ||
                                            errors.login
                                                ? "border border-red-600 focus:ring-red-600 focus:border-red-600"
                                                : "border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                        }
                                    />
                                    {(validationErrors.login ||
                                        errors.login) && (
                                        <div className="text-red-500 text-xs italic">
                                            {validationErrors.login ||
                                                errors.login}
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
                                <div className="pt-5">
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Masuk
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <div className="flex flex-col items-center">
                                <a
                                    href="#"
                                    className="flex items-center text-2xl font-semibold text-gray-900"
                                >
                                    <img
                                        className="w-8 h-8 mr-2"
                                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                                        alt="logo"
                                    />
                                    Flowbite
                                </a>
                                
                            </div>
                            <ThemeProvider theme={defaultTheme}>
                                <Container component="main" maxWidth="xs">
                                    <CssBaseline />
                                    <Box
                                        sx={{
                                            marginTop: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            component="form"
                                            onSubmit={submit}
                                            noValidate
                                            sx={{ mt: 0 }}
                                        >
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                error={Boolean(errors.email)}
                                                helperText={errors.email}
                                                variant="filled"
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                error={Boolean(errors.password)}
                                                helperText={errors.password}
                                                variant="filled"
                                            />

                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                                Sign In
                                            </Button>
                                        </Box>
                                    </Box>
                                </Container>
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* </GuestLayout> */}
        </>
    );
}
