import * as Yup from "yup";

const userSchema = Yup.object().shape({
    login: Yup.string().required("Username atau Email harus diisi"),
    password: Yup.string()
        .required("Password wajib diisi")
        .min(8, "Password minimal 8 karakter"),
});

export default userSchema;
