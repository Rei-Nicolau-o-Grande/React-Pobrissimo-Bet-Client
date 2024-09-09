import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axiosInstance from "../../helper/axios-instance.js";
import {Alert, Button, Checkbox, Label, Modal, TextInput, Dropdown} from "flowbite-react";
import validator from "validator";

function FormUpdateUser({ openModal, setOpenModal, userData, onCloseModal }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors},
        reset
    } = useForm();
    // const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    useEffect(() => {
        if (openModal && userData) {
            setValue("username", userData.username);
            setValue("email", userData.email);
        }
    }, [openModal, userData, setValue]);

    const onSubmitUpdateUser = async (formDataUpdate) => {
        const currentUsername = userData.username;
        const currentEmail = userData.email;
        const { username, email, password } = formDataUpdate;

        if (username === currentUsername && email === currentEmail && !password) {
            setApiError("Você deve alterar pelo menos um campo.");
            return;
        }

        setLoading(true);
        setApiError(null);
        await axiosInstance.put(`/users/${userData.id}`, formDataUpdate, {
            headers: {
                Authorization: `Bearer ${cookies.accessToken}`
            }
        })
            .then(
                response => {
                    setData(response.data);
                    setLoading(false);
                    onCloseModal();
                }
            )
            .catch(
                error => {
                    setApiError(error.response.data.message);
                    setLoading(false);
                }
            );
    }

    function handleClose() {
        setOpenModal(false);
        setApiError(null);
        reset();
    }

    return (
        <>
            <Modal dismissible show={openModal} size="md" onClose={handleClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitUpdateUser)}>
                        <div className="space-y-6">
                            {loading && <Alert color={"cyan"}>Loading...</Alert>}
                            {apiError && <Alert color={"failure"}>{apiError}</Alert>}

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar Conta</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="username" value="Usuário"
                                           color={`${errors.username ? 'failure' : ''}`}/>
                                </div>
                                <TextInput
                                    id="username"
                                    type="text"
                                    placeholder="Usuário"
                                    color={`${errors.username ? 'failure' : ''}`}
                                    {...register("username", {
                                        required: true,
                                        validate: {
                                            unique: async (value) => {
                                                const currentUsername = userData.username;
                                                if (value !== currentUsername) {
                                                    return await axiosInstance.get(`/validation/username/${value}`)
                                                        .then(response => !response.data)
                                                        .catch(error => error.response.data.errorFields.username.join(' '));
                                                }
                                                return true;
                                            }
                                        }
                                    })}
                                    helperText={
                                        errors?.username?.type === "required" ? 'Campo obrigatório.' : '' ||
                                        errors?.username?.type === "unique" ? errors.username?.message : ''
                                    }
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Email"
                                           color={`${errors.email ? 'failure' : ''}`}/>
                                </div>
                                <TextInput
                                    id="email"
                                    placeholder="email@email.com"
                                    color={`${errors.email ? 'failure' : ''}`}
                                    {...register("email",{
                                        required: true,
                                        validate: {
                                            email: (value) => validator.isEmail(value),
                                            unique: async (value) => {
                                                const currentEmail = userData.email;
                                                if (value !== currentEmail) {
                                                    return await axiosInstance.get(`/validation/email/${value}`)
                                                        .then(response => !response.data)
                                                        .catch(error => error.response.data.errorFields.email.join(' '));
                                                }
                                                return true;
                                            }
                                        }
                                    })}
                                    helperText={
                                        errors?.email?.type === "required" ? 'Campo obrigatório.' : '' ||
                                        errors?.email?.type === "email" ? 'Email inválido.' : '' ||
                                        errors?.email?.type === "unique" ? errors.email?.message : ''
                                    }
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password" value="Senha"
                                           color={`${errors.password ? 'failure' : ''}`}/>
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    color={`${errors.password ? 'failure' : ''}`}
                                    {...register("password",{
                                        validate: {
                                            minLength: (value) => value.length === 0 || value.length >= 6 || "Mínimo 6 caracteres.",
                                            hasUpperCase: (value) => value.length === 0 || /[A-Z]/.test(value) || "Deve conter pelo menos uma letra maiúscula.",
                                            hasLowerCase: (value) => value.length === 0 || /[a-z]/.test(value) || "Deve conter pelo menos uma letra minúscula.",
                                            hasNumber: (value) => value.length === 0 || /\d/.test(value) || "Deve conter pelo menos um número."
                                        }

                                    })}
                                    helperText={
                                        errors?.password?.message ||
                                        (errors?.password?.type === "minLength" && errors?.password?.message) ||
                                        (errors?.password?.type === "hasUpperCase" && errors?.password?.message) ||
                                        (errors?.password?.type === "hasLowerCase" && errors?.password?.message) ||
                                        (errors?.password?.type === "hasNumber" && errors?.password?.message)
                                    }
                                />
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember"/>
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>
                                <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                                    Lost Password?
                                </a>
                            </div>
                            <div className="w-full">
                                <Button type={"submit"} disabled={Object.keys(errors).length > 0}>Atualizar</Button>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                                Not registered?&nbsp;
                                <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
                                    Entrar
                                </a>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FormUpdateUser;