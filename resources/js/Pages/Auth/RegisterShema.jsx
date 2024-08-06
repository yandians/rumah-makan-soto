import * as Yup from "yup";

const registerSchema = Yup.object().shape({
    name: Yup.string().required("Nama wajib diisi"),
    username: Yup.string().required("Username wajib diisi"),
    email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: Yup.string()
        .required("Password wajib diisi")
        .min(8, "Password minimal 8 karakter"),
    password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], "Konfirmasi password tidak cocok")
        .required("Konfirmasi password wajib diisi"),
});

export default registerSchema;
