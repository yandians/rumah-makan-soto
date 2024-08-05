import {
    Button,
    Modal,
    TextInput,
    Label,
    Select,
    FileInput,
} from "flowbite-react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { HiOutlinePlusSm } from "react-icons/hi";
import MakananSchema from "./MakananSchema";

function formatRupiah(angka) {
    let cleaned = ("" + angka).replace(/\D/g, "");
    let formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(parseInt(cleaned));

    return formatted;
}

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
        nama: "",
        kategori: "",
        harga: 0,
        image: null,
        deskripsi: "",
    });

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleToggleModal = () => {
        setOpenModalCreate(!openModalCreate);
    };

    const parseRupiah = (value) => {
        return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const handleRupiahInputChange = (event) => {
        const { value } = event.target;
        setData((prevData) => ({
            ...prevData,
            harga: parseRupiah(value),
        }));
    };

    const [validationErrors, setValidationErrors] = useState({});

    const handleReset = () => {
        reset();
        setValidationErrors({});
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MakananSchema.validate(data, { abortEarly: false });
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
            post("/makanan", {
                data: formData,
                onSuccess: () => {
                    reset();
                    setOpenModalCreate(false);
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prevData) => ({
                ...prevData,
                image: file,
            }));
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
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
                <HiOutlinePlusSm className="text-xl mr-2" /> Tambah Makanan
            </Button>
            <Modal
                show={openModalCreate}
                onClose={() => setOpenModalCreate(false)}
            >
                <Modal.Header>Tambah Makanan</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="nama" value="Nama Makanan" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="nama"
                                placeholder="Nama Makanan"
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                value={data.nama}
                                required
                                color={
                                    validationErrors.nama || errors.nama
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.nama || errors.nama) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.nama || errors.nama}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="kategori" value="Kategori" />
                            </div>
                            <Select
                                id="kategori"
                                onChange={(e) =>
                                    setData("kategori", e.target.value)
                                }
                                value={data.kategori}
                                required
                            >
                                <option>Pilih Kategori</option>
                                <option value="makanan">Makanan</option>
                                <option value="minuman">Minuman</option>
                                <option value="lainnya">Lainnya</option>
                            </Select>
                            {(validationErrors.kategori || errors.kategori) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.kategori ||
                                        errors.kategori}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="harga" value="Harga" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="harga"
                                type="text"
                                placeholder="Harga"
                                value={formatRupiah(data.harga)}
                                onChange={handleRupiahInputChange}
                                color={
                                    validationErrors.harga || errors.harga
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.harga || errors.harga) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.harga || errors.harga}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="deskripsi" value="Deskripsi" />
                            </div>
                            <TextInput
                                theme={customTheme}
                                id="deskripsi"
                                placeholder="Deskripsi"
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                                value={data.deskripsi}
                                required
                                color={
                                    validationErrors.deskripsi || errors.deskripsi
                                        ? "failure"
                                        : "gray"
                                }
                            />
                            {(validationErrors.deskripsi || errors.deskripsi) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.deskripsi || errors.deskripsi}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <Label
                                htmlFor="dropzone-file"
                                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                            >
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    <svg
                                        className="mb-4 h-8 w-8 text-gray-500"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    {previewImage ? (
                                        <>
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="h-32 w-32 object-cover"
                                            />
                                            <p className="mt-2 text-sm text-gray-500">
                                                {data.image && data.image.name}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <FileInput
                                    id="dropzone-file"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </Label>
                            {(validationErrors.image || errors.image) && (
                                <div className="text-red-500 text-xs italic">
                                    {validationErrors.image || errors.image}
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
                            <Button type="submit" color="success">
                                Simpan
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
