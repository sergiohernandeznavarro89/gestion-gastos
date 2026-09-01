import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { GetAccountsByUser } from 'services/account/AccountService';
import { GetPendingPayItems } from 'services/item/ItemService';
import { GetNextMonthPendingPayItems } from 'services/item/ItemService';

import { AccountResponse } from 'models/account/AccountResponse';
import { PendingPayItemsResponse } from 'models/item/PendingPayItemResponse';
import { PendingTransferResponse } from 'models/transfer/PendingTransferResponse';
import { GetPendingPayTransfers, GetNextMonthPendingPayTransfers } from 'services/transfer/TransferService';

import AccountSlider from 'components/AccountSlider';
import PendingPayItems, { UnifiedPendingItem } from 'components/PendingPayItems';
import Spinner from 'components/Spinner';

interface Props {
    userId: number
}

const Home: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [pendingPayItems, setPendingPayItems] = useState<UnifiedPendingItem[]>([]);
    const [pendingPayItemsNextMonth, setPendingPayItemsNextMonth] = useState<UnifiedPendingItem[]>([]);
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
                    pendingPayResponse,
                    pendingPayNextMonthResponse,
                    pendingTransfersResponse,
                    pendingTransfersNextMonthResponse
                ] = await Promise.all([
                    GetAccountsByUser(userId),
                    GetPendingPayItems(userId),
                    GetNextMonthPendingPayItems(userId),
                    GetPendingPayTransfers(userId),
                    GetNextMonthPendingPayTransfers(userId)
                ]);
                setAccounts(accountsResponse);

                const unifiedPending: UnifiedPendingItem[] = [
                    ...pendingPayResponse.map(i => ({
                        id: i.itemId,
                        name: i.itemName,
                        startDate: i.startDate,
                        desc: i.itemDesc,
                        ammount: i.ammount,
                        ammountTypeId: i.ammountTypeId,
                        itemTypeId: i.itemTypeId,
                        type: 'item' as const,
                        accountDesc: i.accountName
                    })),
                    ...pendingTransfersResponse.map(t => ({
                        id: t.transferId,
                        name: t.transferName,
                        startDate: t.startDate,
                        desc: t.transferDesc,
                        ammount: t.ammount,
                        ammountTypeId: 1, // Fixed
                        type: 'transfer' as const,
                        accountDesc: `${t.originAccountName} -> ${t.destinationAccountName}`
                    }))
                ].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

                const unifiedPendingNextMonth: UnifiedPendingItem[] = [
                    ...pendingPayNextMonthResponse.map(i => ({
                        id: i.itemId,
                        name: i.itemName,
                        startDate: i.startDate,
                        desc: i.itemDesc,
                        ammount: i.ammount,
                        ammountTypeId: i.ammountTypeId,
                        itemTypeId: i.itemTypeId,
                        type: 'item' as const,
                        accountDesc: i.accountName
                    })),
                    ...pendingTransfersNextMonthResponse.map(t => ({
                        id: t.transferId,
                        name: t.transferName,
                        startDate: t.startDate,
                        desc: t.transferDesc,
                        ammount: t.ammount,
                        ammountTypeId: 1, // Fixed
                        type: 'transfer' as const,
                        accountDesc: `${t.originAccountName} -> ${t.destinationAccountName}`
                    }))
                ].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

                setPendingPayItems(unifiedPending);
                setPendingPayItemsNextMonth(unifiedPendingNextMonth);
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