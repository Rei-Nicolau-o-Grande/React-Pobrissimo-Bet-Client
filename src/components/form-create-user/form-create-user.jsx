import {Alert, Button, Checkbox, Label, Modal, TextInput} from "flowbite-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import validator from "validator";
import {useCookies} from "react-cookie";
import axiosInstance from "../../helper/axios-instance.js";

function FormCreateUser() {
    const {
        register,
        handleSubmit,
        formState: { errors},
        reset
    } = useForm();
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    const onSubmitCreateUser = async (formData) => {
        setLoading(true);
        setApiError(null);
        await axiosInstance.post("/users", formData)
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

    function onCloseModal() {
        setOpenModal(false);
        setApiError(null);
        reset();
    }

    return (
        <>
            <Button onClick={() => setOpenModal(true)} color={"blue"} className={"my-3"} pill>Criar Conta</Button>
            <Modal dismissible show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmitCreateUser)}>
                        <div className="space-y-6">
                            {loading && <Alert color={"cyan"}>Loading...</Alert>}
                            {apiError && <Alert color={"failure"}>{apiError}</Alert>}

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Criar Conta</h3>
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
                                                return await axiosInstance.get(`/validation/username/${value}`)
                                                    .then(response => !response.data)
                                                    .catch(error => error.response.data.errorFields.username.join(' '));
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
                                                return await axiosInstance.get(`/validation/email/${value}`)
                                                    .then(response => !response.data)
                                                    .catch(error => error.response.data.errorFields.email.join(' '));
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
                                        required: true,
                                        minLength: {
                                            value: 6,
                                            message: "Mínimo 6 caracteres."
                                        },
                                        validate: {
                                            hasUpperCase: value => /[A-Z]/.test(value) || "Deve conter pelo menos uma letra maiúscula.",
                                            hasLowerCase: value => /[a-z]/.test(value) || "Deve conter pelo menos uma letra minúscula.",
                                            hasNumber: value => /\d/.test(value) || "Deve conter pelo menos um número."
                                        }

                                    })}
                                    helperText={
                                        errors?.password?.message ||
                                        (errors?.password?.type === "required" ? 'Campo obrigatório.' : '') ||
                                        (errors?.password?.type === "minLength" ? 'Mínimo 6 caracteres.' : '') ||
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
                                <Button type={"submit"} disabled={Object.keys(errors).length > 0}>Criar</Button>
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

export default FormCreateUser;