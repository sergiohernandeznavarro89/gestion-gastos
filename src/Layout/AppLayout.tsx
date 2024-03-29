import { Avatar, Dropdown, Link, Navbar, Text } from '@nextui-org/react'
import Layout from 'Layout/Layout'
import { useDispatch, useSelector } from 'react-redux';
import * as UserActions from "store/actions/UserActions";
import * as MenuActions from "store/actions/MenuActions";
import { useNavigate } from 'react-router-dom';

const AppLayout = () => {

    const user = useSelector((state: any) => state.userState);
    const menu = useSelector((state: any) => state.menuState);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const clickMenu = (idx: number) => {
        dispatch(MenuActions.SetMenu({menuId: idx}) as any);
    }

    const menuItems = [
        {
            name: "Home",
            path: "/",
            idx: 0
        },
        {
            name: "Cuentas",
            path: "/cuentas",
            idx: 1
        },
        {
            name: "Pagos/Ingresos",
            path: "/pagos-cobros",
            idx: 2
        },
        {
            name: "Categorias",
            path: "/categorias",
            idx: 3
        },
        {
            name: "Deudas",
            path: "/Deudas",
            idx: 4
        },
    ];

    const logoutClick = () => {
        dispatch(UserActions.SetUser({
            userName: '',
            userEmail: '',
            userLastName: '',
            userId: 0,
        }) as any);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <Layout>
            <Navbar variant="sticky" style={{position:'fixed', background:'white'}}>
                <Navbar.Toggle showIn="xs"/>
                <Navbar.Brand
                    css={{
                        "@xs": {
                            w: "12%",
                        },
                    }}
                >
                    <Text color="primary" size="$2xl" weight="bold">Gestion-Cuentas</Text>
                </Navbar.Brand>
                <Navbar.Content
                    enableCursorHighlight
                    activeColor="primary"
                    hideIn="xs"
                    variant="highlight"
                >
                    {menuItems.map(x => (<Navbar.Link isActive={x.idx === menu.menuId} key={`menuDesktop-${x.idx}`} href={x.path}>{x.name}</Navbar.Link>))}
                </Navbar.Content>
                <Navbar.Content
                    css={{
                        "@xs": {
                            w: "12%",
                            jc: "flex-end",
                        },
                    }}
                >
                    <Dropdown placement="bottom-right">
                        <Navbar.Item>
                            <Dropdown.Trigger>
                                <Avatar
                                    bordered
                                    as="button"
                                    color="primary"
                                    textColor={'white'}
                                    size="md"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                            </Dropdown.Trigger>
                        </Navbar.Item>
                        <Dropdown.Menu
                            aria-label="User menu actions"
                            color="primary"
                            onAction={(actionKey) => console.log({ actionKey })}
                        >
                            <Dropdown.Item key="profile" css={{ height: "$18" }}>
                                <Text b color="inherit" css={{ d: "flex" }}>
                                    {user.userEmail}
                                </Text>
                            </Dropdown.Item>
                            <Dropdown.Item key="logout" withDivider color="error">
                                <div className='w-12' onClick={logoutClick}>Log Out</div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Content>
                <Navbar.Collapse disableAnimation>
                    {menuItems.map((item, index) => (
                        <Navbar.CollapseItem
                            key={`${item.idx}-${item.name}`}
                            activeColor="primary"
                            isActive={index === menu.menuId}
                        >
                            <Link
                                color="inherit"
                                css={{
                                    minWidth: "100%",
                                }}
                                href={item.path}
                                onClick={() => clickMenu(item.idx)}
                            >
                                {item.name}
                            </Link>
                        </Navbar.CollapseItem>
                    ))}
                </Navbar.Collapse>
            </Navbar>
        </Layout>
    )
}

export default AppLayout