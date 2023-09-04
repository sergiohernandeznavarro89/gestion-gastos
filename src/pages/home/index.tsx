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

interface Props {
    userId: number
}

const Home: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [pendingPayItems, setPendingPayItems] = useState<PendingPayItemsResponse[]>([]);
    const [pendingPayItemsNextMonth, setPendingPayItemsNextMonth] = useState<PendingPayItemsResponse[]>([]);

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 0,
        }) as any);
    }, [])

    useEffect(() => {
        if (userId) {
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
            })();
        }
    }, [userId, refresh]);

    return (
        <>
            <div className='flex flex-column w-12' style={{marginTop:'80px'}}>
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