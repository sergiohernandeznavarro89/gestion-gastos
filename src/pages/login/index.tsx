import { useEffect } from 'react';
import { LoginBackground, LoginCard, ValidationSpan } from './styled'
import { Button, Card, Input, Text } from '@nextui-org/react'
import { useForm } from 'react-hook-form';
import { getUserByEmail } from 'services/user/UserService';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as UserActions from "store/actions/UserActions";
import { UserResponse } from 'models/user/UserResponse';

const Login = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    const displayToastError = (message: string) => toast.error(message);

    const onSubmit = async (data: any) => {
        const response = await getUserByEmail(data.email);

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
                            <Input
                                clearable
                                {...register("email", { required: true })}
                                bordered
                                labelPlaceholder="Email"
                                color={!errors.email ? 'primary' : 'error'}
                            />
                            {errors.email && <ValidationSpan>field email is required</ValidationSpan>}
                        </div>

                        <div className='flex flex-column gap-1'>
                            <Input
                                type='password'
                                clearable
                                {...register("password", { required: true })}
                                bordered
                                labelPlaceholder="Password"
                                color={!errors.password ? 'primary' : 'error'}
                            />
                            {errors.password && <ValidationSpan> field password is required</ValidationSpan>}
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