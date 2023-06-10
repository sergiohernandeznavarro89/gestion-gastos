import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { GetAccountsByUser } from 'services/account/AccountService';

import { AccountResponse } from 'models/account/AccountResponse';

import AccountSlider from 'components/AccountSlider';

interface Props {
    userId: number
}

const Home: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 0,
        }) as any);
    }, [])

    useEffect(() => {
        if (userId) {
            (async () => {
                const [
                    accountsResponse
                ] = await Promise.all([
                    GetAccountsByUser(userId)
                ]);
                setAccounts(accountsResponse)
            })();
        }
    }, [userId, refresh]);

    return (
        <>
            <div className='flex flex-column gap-2 w-12'>
                <AccountSlider accounts={accounts} refresh={() => setRefresh(!refresh)} />
            </div>
        </>
    )
}

export default Home