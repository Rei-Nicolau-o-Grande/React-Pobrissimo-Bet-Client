import {Alert, Button, Label, TextInput} from "flowbite-react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axiosInstance from "../../helper/axios-instance.js";
import {useCookies} from "react-cookie";
import { maskMoneyDisplay, unmaskMoney } from "../../helper/mask.js";

function FormTransactionDeposit({walletData, setOpenModal, fetchWalletData}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm();
    const [data, setData] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

    const onSubmitTransactionDeposit = async (formData) => {
        setLoading(true);
        setApiError(null);

        const formattedData = {
            ...formData,
            value: unmaskMoney(formData.value)
        };

        if (cookies.accessToken && confirm("Você deseja depositar ?")) {
            await axiosInstance.post(`/transactions/deposit/${walletData.id}`, formattedData, {
                headers: {
                    Authorization: `Bearer ${cookies.accessToken}`
                }
            })
        .then(
                response => {
                    setData(response.data);
                    setLoading(false);
                    fetchWalletData();
                    handleClose();
                }
            )
                .catch(
                    error => {
                        setApiError(error.response.data);
                        setLoading(false);
                    }
                );
        } else {
            setLoading(false);
            handleClose();
        }
    };

    function handleClose() {
        setOpenModal(false);
        setApiError(null);
        reset();
    }

    const value = watch("value");

    useEffect(() => {
        setValue("value", maskMoneyDisplay(value));
    }, [value]);

    return (
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmitTransactionDeposit)}>
            {loading && <Alert color={"cyan"}>Loading...</Alert>}
            {apiError && <Alert color={"failure"}>{apiError.message}</Alert>}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="Deposit" value="Valor" />
                </div>
                <TextInput
                    id="Deposit"
                    type="text"
                    autoComplete="off"
                    placeholder="0.00"
                    value={maskMoneyDisplay(value)}
                    {...register("value", {
                        required: "Campo obrigatório",
                        onChange: (e) => setValue('value', maskMoneyDisplay(e.target.value)),
                    })}
                    color={`${errors?.value || apiError?.errorFields?.value ? 'failure' : ''}`}

                    helperText={
                        errors?.value?.message ??
                        (apiError?.errorFields?.value?.length > 0 ?
                                apiError.errorFields.value.join(', ') :
                                ''
                        )
                    }
                />
            </div>
            <Button type="submit">Enviar</Button>
        </form>
    );
}

export default FormTransactionDeposit;