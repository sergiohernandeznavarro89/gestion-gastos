import { useEffect } from 'react';
import { LoginBackground, LoginCard, ValidationSpan } from './styled'
import { Button, Card, Input, Text } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form';
import { GetUserByEmail } from 'services/user/UserService';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as UserActions from "store/actions/UserActions";
import { UserResponse } from 'models/user/UserResponse';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

const Login = () => {

    const defaultValues = {
        email: '',
        password: '',
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({ defaultValues });

    // const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    const displayToastError = (message: string) => toast.error(message);

    const onSubmit = async (data: any) => {
        const response = await GetUserByEmail(data.email);

        if (response?.userEmail === data.email) {
            if (data.password === response.userPass) {
                localStorage.setItem("user", JSON.stringify(response));
                dispatch(UserActions.SetUser(response) as any);
            }
            else {
                displayToastError("Login Error");
            }
        }
        else {
            displayToastError("Login Error");
        }
    };

    return (
        <LoginBackground className='flex align-items-center justify-content-center w-12 flex-column'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <LoginCard>
                <Card.Body className='flex flex-column gap-5 justify-content-center align-items-center'>
                    <Text color="primary" size="$2xl" weight="bold">Login</Text>
                    <form className='flex flex-column gap-5 w-11' onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex flex-column gap-1'>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email es requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.email })}></label>
                                        <span className="p-float-label">
                                            <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                            <label htmlFor={field.name}>Email</label>
                                        </span>
                                        {errors.email && <small className="p-error">{errors.email.message}</small>}
                                    </>
                                )}
                            />                                     
                        </div>

                        <div className='flex flex-column gap-1'>
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'Password es requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.password })}></label>
                                        <span className="p-float-label">
                                            <Password id={field.name}  className={`w-12 p-inputtext-sm ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} feedback={false} toggleMask />
                                            <label htmlFor={field.name}>Contraseña</label>
                                        </span>
                                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                                    </>
                                )}
                            />                                   
                        </div>

                        <div className='flex justify-content-center'>
                            <Button type='submit' className='w-6'>Login</Button>
                        </div>
                    </form>
                </Card.Body>
            </LoginCard>
        </LoginBackground>
    )
}

export default Login