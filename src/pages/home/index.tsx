import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { GetAccountsByUser } from 'services/account/AccountService';

import { AccountResponse } from 'models/account/AccountResponse';

import AccountSlider from 'components/AccountSlider';
import { GetPendingPayItems } from 'services/item/ItemService';
import { PendingPayItemsResponse } from 'models/item/PendingPayItemResponse';
import PendingPayItems from 'components/PendingPayItems';

interface Props {
    userId: number
}

const Home: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [pendingPayItems, setPendingPayItems] = useState<PendingPayItemsResponse[]>([]);

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
                    pendingPayRespnose
                ] = await Promise.all([
                    GetAccountsByUser(userId),
                    GetPendingPayItems(userId)
                ]);
                setAccounts(accountsResponse);
                setPendingPayItems(pendingPayRespnose);
            })();
        }
    }, [userId, refresh]);

    return (
        <>
            <div className='flex flex-column w-12' style={{marginTop:'80px'}}>
                <AccountSlider accounts={accounts} refresh={() => setRefresh(!refresh)} />
                <PendingPayItems refresh={() => setRefresh(!refresh)} pendingPayItems={pendingPayItems}/>
            </div>
        </>
    )
}

export default Home