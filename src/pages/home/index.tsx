import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { GetAccountsByUser } from 'services/account/AccountService';
import { GetPendingPayItems } from 'services/item/ItemService';
import { GetNextMonthPendingPayItems } from 'services/item/ItemService';

import { AccountResponse } from 'models/account/AccountResponse';
import { PendingPayItemsResponse } from 'models/item/PendingPayItemResponse';

import AccountSlider from 'components/AccountSlider';
import PendingPayItems from 'components/PendingPayItems';
import { RingLoader } from 'react-spinners';
import Spinner from 'components/Spinner';

interface Props {
    userId: number
}

const Home: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [pendingPayItems, setPendingPayItems] = useState<PendingPayItemsResponse[]>([]);
    const [pendingPayItemsNextMonth, setPendingPayItemsNextMonth] = useState<PendingPayItemsResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 0,
        }) as any);
    }, [])

    useEffect(() => {
        if (userId) {
            setLoading(true);
            (async () => {
                const [
                    accountsResponse,
                    pendingPayRespnose,
                    pendingPayNextMonthResponse
                ] = await Promise.all([
                    GetAccountsByUser(userId),
                    GetPendingPayItems(userId),
                    GetNextMonthPendingPayItems(userId),
                ]);
                setAccounts(accountsResponse);
                setPendingPayItems(pendingPayRespnose);
                setPendingPayItemsNextMonth(pendingPayNextMonthResponse);
                setLoading(false);
            })();
        }
    }, [userId, refresh]);

    return (
        <>
            <div className='flex flex-column w-12' style={{marginTop:'80px'}}>
                {loading && <Spinner loading={loading}/>}
                <AccountSlider accounts={accounts} refresh={() => setRefresh(!refresh)} />
                <PendingPayItems 
                    refresh={() => setRefresh(!refresh)} 
                    pendingPayItems={pendingPayItems}
                    pendingPayItemsNextMonth={pendingPayItemsNextMonth}
                />
            </div>
        </>
    )
}

export default Home