import { useEffect, useState } from 'react';
import { LoginBackground, LoginCard, ValidationSpan } from './styled'
import { Button, Card, Input, Text } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form';
import { Login as LoginUser, Register as RegisterUser } from 'services/user/UserService';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as UserActions from "store/actions/UserActions";
import { UserResponse } from 'models/user/UserResponse';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const defaultValues = {
        name: '',
        lastName: '',
        email: '',
        password: '',
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({ defaultValues });

    const dispatch = useDispatch();

    const displayToastError = (message: string) => toast.error(message);
    const displayToastSuccess = (message: string) => toast.success(message);

    const onSubmit = async (data: any) => {
        if (isRegistering) {
            try {
                await RegisterUser(data.name, data.lastName, data.email, data.password);
                displayToastSuccess("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
                setIsRegistering(false);
                reset();
            } catch (error) {
                displayToastError("Error al registrar el usuario. Revisa los datos.");
            }
        } else {
            try {
                const response = await LoginUser(data.email, data.password);
                
                if (response && response.token) {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.user));
                    dispatch(UserActions.SetUser(response.user) as any);
                } else {
                    displayToastError("Credenciales incorrectas");
                }
            } catch (error) {
                displayToastError("Error en el inicio de sesión");
            }
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
                    <Text color="primary" size="$2xl" weight="bold">{isRegistering ? 'Registro' : 'Login'}</Text>
                    <form className='flex flex-column gap-5 w-11' onSubmit={handleSubmit(onSubmit)}>
                        
                        {isRegistering && (
                            <>
                                <div className='flex flex-column gap-1 mt-3'>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Nombre es requerido' }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <span className="p-float-label">
                                                    <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                                    <label htmlFor={field.name}>Nombre</label>
                                                </span>
                                                {errors.name && <small className="p-error">{errors.name.message}</small>}
                                            </>
                                        )}
                                    />                                     
                                </div>
                                <div className='flex flex-column gap-1'>
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        rules={{ required: 'Apellidos son requeridos' }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <span className="p-float-label">
                                                    <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                                    <label htmlFor={field.name}>Apellidos</label>
                                                </span>
                                                {errors.lastName && <small className="p-error">{errors.lastName.message}</small>}
                                            </>
                                        )}
                                    />                                     
                                </div>
                            </>
                        )}

                        <div className={`flex flex-column gap-1 ${!isRegistering ? 'mt-3' : ''}`}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email es requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <span className="p-float-label">
                                            <InputText type="email" id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
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
                                        <span className="p-float-label">
                                            <Password id={field.name}  className={`w-12 p-inputtext-sm ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} feedback={isRegistering} toggleMask />
                                            <label htmlFor={field.name}>Contraseña</label>
                                        </span>
                                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                                    </>
                                )}
                            />                                   
                        </div>

                        <div className='flex flex-column gap-3 justify-content-center align-items-center mt-2'>
                            <Button type='submit' className='w-8'>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</Button>
                            
                            <Button 
                                light 
                                color="primary" 
                                auto 
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    reset();
                                }}
                            >
                                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                            </Button>
                        </div>
                    </form>
                </Card.Body>
            </LoginCard>
        </LoginBackground>
    )
}

export default Login