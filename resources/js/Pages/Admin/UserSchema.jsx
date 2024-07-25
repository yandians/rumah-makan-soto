import * as Yup from "yup";

const UserSchema = Yup.object().shape({
    name: Yup.string().required("Nama harus diisi"),
    username: Yup.string()
        .required("Username harus diisi")
        .matches(/^[a-zA-Z0-9_]+$/, "Username hanya boleh mengandung huruf, angka, dan underscore"),
    email: Yup.string()
        .required("Email harus diisi")
        .email("Email tidak valid"),
    level: Yup.string()
        .required("Level harus diisi")
        .oneOf(["owner", "pegawai"], "Level tidak valid"),
    password: Yup.string()
        .required("Password harus diisi")
        .min(8, "Password harus terdiri dari minimal 8 karakter"),
    confirmPassword: Yup.string()
        .required("Konfirmasi password harus diisi")
        .oneOf([Yup.ref('password'), null], "Konfirmasi password tidak cocok dengan password"),
});

export default UserSchema;
