import { Avatar, Dropdown, Link, Navbar, Text } from '@nextui-org/react'
import Layout from 'Layout/Layout'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as UserActions from "store/actions/UserActions";

const AppLayout = () => {

    const user = useSelector((state: any) => state.userState);
    const dispatch = useDispatch();

    const collapseItems = [
        "Home",
        "Accounts",
        "Payments",
    ];

    const logoutClick = () => {
        debugger;
        dispatch(UserActions.SetUser({
            userName: '',
            userEmail: '',
            userLastName: '',
            userId: 0,
        }) as any);
        localStorage.removeItem('user');
    };

    return (
        <Layout>
            <Navbar isBordered variant="sticky">
                <Navbar.Toggle showIn="xs" />
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
                    <Navbar.Link href="#">Home</Navbar.Link>
                    <Navbar.Link isActive href="#">Accounts</Navbar.Link>
                    <Navbar.Link href="#">Payments</Navbar.Link>
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
                    {collapseItems.map((item, index) => (
                        <Navbar.CollapseItem
                            key={item}
                            activeColor="primary"
                            isActive={index === 2}
                        >
                            <Link
                                color="inherit"
                                css={{
                                    minWidth: "100%",
                                }}
                                href="#"
                            >
                                {item}
                            </Link>
                        </Navbar.CollapseItem>
                    ))}
                </Navbar.Collapse>
            </Navbar>
        </Layout>
    )
}

export default AppLayout