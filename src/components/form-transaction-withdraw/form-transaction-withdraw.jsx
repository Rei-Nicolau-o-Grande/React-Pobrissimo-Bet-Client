import {Alert, Button, Label, TextInput} from "flowbite-react";
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../helper/axios-instance.js";
import {useCookies} from "react-cookie";
import { maskMoneyDisplay, unmaskMoney } from "../../helper/mask.js";


function FormTransactionWithDraw({walletData, setOpenModal, fetchWalletData}) {
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

    const onSubmitTransactionWithDraw = async (formData) => {
        setLoading(true);
        setApiError(null);

        const formattedData = {
            ...formData,
            value: unmaskMoney(formData.value)
        };

        if (cookies.accessToken && confirm("Você deseja sacar ?")) {
            await axiosInstance.post(`/transactions/withdraw/${walletData.id}`, formattedData, {
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
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmitTransactionWithDraw)}>
            {loading && <Alert color={"cyan"}>Loading...</Alert>}
            {apiError && <Alert color={"failure"}>{apiError.message}</Alert>}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="WithDraw" value="Valor" />
                </div>
                <TextInput
                    id="WithDraw"
                    type="text"
                    autoComplete="off"
                    placeholder="0.00"
                    color={`${errors?.value || apiError?.errorFields?.value ? 'failure' : ''}`}
                    value={maskMoneyDisplay(value)}
                    {...register("value", {
                        required: "Campo obrigatório",
                        onChange: (e) => setValue('value', maskMoneyDisplay(e.target.value))
                    })}
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

export default FormTransactionWithDraw;