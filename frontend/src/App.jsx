import './App.css'

import logo from './logo.svg'
import cartWhite from './cartWhite.png'
import cartBlack from './cartBlack.png'

import Home from "./components/Home"
import WineList from "./components/WineList"
import WineEdit from "./components/WineEdit"
import WineInfo from "./components/WineInfo"
import NoPage from "./components/NoPage"
import OrderList from "./components/OrderList"
import OrderEdit from "./components/OrderEdit"

import { Login }  from "./components/Login"
import { Register } from "./components/Register"

import {
    MantineProvider,
    AppShell,
    Header,
    ActionIcon,
    Group,
    Space,
    Title,
    rem,
    Button,
    Portal,
    Text
} from '@mantine/core';
import { createStyles } from '@mantine/styles';

import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import localforage from 'localforage';
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { FiX } from "react-icons/fi";
import { useWindowScroll } from "@mantine/hooks";

import useWineCartState from './state/wineCartState';
import AuthService from "./state/AuthService";

function getItem(key, stateSetter, defaultValue) {
    localforage.getItem(key).then(value => stateSetter(value)).catch(_ => {
        stateSetter(defaultValue);
        localforage.setItem(key, defaultValue);
    });
}

function App() {
    const defaultColorScheme = 'dark';
    const [colorScheme, setColorScheme] = useState(defaultColorScheme);
    const [cartOpen, setCartOpen] = useState(false);
    const { winesCart, addItem, removeItem, clearCart } = useWineCartState();

    const toggleCart = () => {
        setCartOpen(!cartOpen);
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        winesCart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        return totalPrice;
    };
    const totalPrice = calculateTotalPrice();

    // load preferences using localForage
    useEffect(
        () => getItem('colorScheme', setColorScheme, defaultColorScheme),
        []
    );

    const adminViews = [
        { component: Home, path: '/', exact: true, name: 'Home' },
        { component: WineList, path: '/wines', exact: true, name: 'Manage Wines' },
        { component: OrderList, path: '/orders', exact: true, name: 'Manage Orders'}
    ];

    const userViews = [
        { component: Home, path: '/', exact: true, name: 'Home' },
        { component: WineList, path: '/wines', exact: true, name: 'See Our Wines' },
        { component: OrderList, path: '/orders', exact: true, name: 'See Your Orders'}
    ];

    const commonerViews = [
        { component: Home, path: '/', exact: true, name: 'Home' },
        { component: WineList, path: '/wines', exact: true, name: 'See Our Wines' },
    ];
    function toggleColorScheme(value) {
        const newValue = value || (colorScheme === 'dark' ? 'light' : 'dark');
        setColorScheme(newValue);
        localforage.setItem('colorScheme', newValue);
    }

    function removeWineStock(id, count) {
        const request = {
            id: id,
            count: count
        };

        return fetch('/api/removeWineStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem('TOKEN')}` },
            body: JSON.stringify(request),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function checkout() {
        const orderObj = {
            id: 1000,
            status: "ORDERED",
            userId: localStorage.getItem('ID'),
            date: new Date().toISOString().slice(0, 10),
            wineIds: winesCart.map((item) => (item.id)),
            quantities: winesCart.map((item) => (item.quantity)),
            totalPrice: calculateTotalPrice(),
        };

        fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem('TOKEN')}` },
            body: JSON.stringify(orderObj),
        })
            .then((response) => response.json())
            .then((data) => {console.log(data);})
            .catch((error) => {console.error('Error:', error);});

        // remove items from wine database
        for (let i = 0; i < winesCart.length; i++) {
            const item = winesCart[i];
            removeWineStock(item.id, item.quantity);
        }
        clearCart();
    }



    const useStyles = createStyles(theme => ({
        navLink: {
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.md,
            color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            textDecoration: 'none',
            willChange: 'transform',

            '&:hover:active': {
                transform: 'translateY(2px)',
            },
        },
        navLinkActive: {
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
        },
        navLinkInactive: {
            '&:hover': {
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1]
            },
        },
        headerWrapper: {
            display: 'flex',
            alignItems: 'center',
            height: '100%'
        },
        appShell: {
            main: { backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] }
        },

        header: {
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'space-between',
        },

        links: {
            justifyContent: 'end'
        },

        link: {
            display: 'block',
            lineHeight: 1,
            padding: `${rem(8)} ${rem(12)}`,
            borderRadius: theme.radius.sm,
            textDecoration: 'none',
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
            fontSize: theme.fontSizes.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({
                    variant: 'light',
                    color: theme.primaryColor,
                }).background,
                color: theme.fn.variant({
                    variant: 'light',
                    color: theme.primaryColor,
                }).color,
            },
        },
    }));

    const { classes } = useStyles();

    function mapNavItems() {
        if(localStorage.getItem('ROLE') === 'ROLE_ADMIN') {
            return (
                adminViews.map((view) => (
                    <Button
                        component="a"
                        href={view.path}
                        variant="subtle"
                        key={view.name}
                    > {view.name} </Button>
                ))
            )
        } else if (localStorage.getItem('ROLE') === 'ROLE_EMPLOYEE') {
            return (
                "Some views for employee"
            )
        } else if (localStorage.getItem('ROLE') === 'ROLE_USER') {
            return (
                userViews.map((view) => (
                    <Button
                        component="a"
                        href={view.path}
                        variant="subtle"ad
                        key={view.name}
                    > {view.name} </Button>
                ))
            )
        } else {
            return (
                commonerViews.map((view) => (
                    <Button
                        component="a"
                        href={view.path}
                        variant="subtle"
                        key={view.name}
                    > {view.name} </Button>
                ))
            )
        }

    }

    function handleLogout() {
        AuthService.logout()
        window.location.reload();
    }

    function loginButtons() {
        if (AuthService.isUserLoggedIn()) {
            return (
                <>
                    <Text>Hello, {localStorage.getItem('LOGGED_IN_USERNAME')}</Text>
                    <Button onClick={() => {handleLogout()}} color="red">Log out</Button>
                </>
            )
        } else {
            return (
                <>
                    <Button component="a" href="/login" variant="outline" color="green">Log in</Button>
                    <Button component="a" href="/register" color="green">Sign up</Button>
                </>
            )
        }
    }

    const [scroll, scrollTo] = useWindowScroll();

    return (
        <MantineProvider theme={{ colorScheme: colorScheme, fontFamily: 'Open Sans, sans serif' }} withGlobalStyles >

            <BrowserRouter>
                <AppShell padding="md" navbarOffsetBreakpoint="sm" fixed
                          header={
                              <Header height={60} px="md">
                                  <Group position="apart" sx={{ height: '100%' }}>
                                      <Group sx={{ height: '100%' }} spacing={5}>
                                          <img
                                              src={logo}
                                              width="30"
                                              height="40"
                                              className={"m-auto"}
                                              alt="logo"
                                          />
                                          <Title order={2} component="a" href="/">WineShop</Title >
                                          <Space w={20} />
                                          {mapNavItems()}
                                      </Group>

                                      <Group>
                                          <Button variant="link" color="green" onClick={toggleCart}>
                                              {colorScheme === 'dark' ? (
                                                  <img src={cartWhite} alt="Cart" width="40" className="m-auto" />
                                              ) : (
                                                  <img src={cartBlack} alt="Cart" width="40" className="m-auto" />
                                              )}
                                          </Button>
                                          {loginButtons()}
                                      </Group>

                                  </Group>
                              </Header>
                          }

                          footer={
                              <Group position="right" spacing="xs">
                                  <ActionIcon variant="default" onClick={() => scrollTo({y: 0})} size={30}>^</ActionIcon>
                                  <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>{colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}</ActionIcon>
                              </Group>
                          }

                          className={classes.appShell}>
                    <Routes>
                        {adminViews.map((view, index) => <Route key={index} exact={view.exact} path={view.path ? view.path : view.name} element={<view.component />} />)}
                        <Route path="/*" element={<NoPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path='/wines/:id' element={<WineEdit />}/>
                        <Route path='/orders/:id' element={<OrderEdit/>}></Route>
                        <Route path='/viewwine/:id' element={<WineInfo />}/>
                    </Routes>
                </AppShell>

                {cartOpen && (
                    <Portal theme={colorScheme}>
                        <div className="cart-window">
                            <div className="cart-header">
                                <div className="cart-title">Shopping Cart</div>
                                <Button variant="link" className="close-button" onClick={toggleCart}><FiX size={20} /></Button>
                            </div>
                            {winesCart.length === 0 ? (
                                <div className="cart-empty">
                                    <Text size="sm">Your cart is empty.</Text>
                                </div>
                            ) : (
                                <>
                                    {winesCart.map((item, index) => (
                                        <div className="cart-item" key={index}>
                                            <div className="cart-item-quantity" style={{ width: '50px' }}>{item.quantity}x</div>
                                            <div className="cart-item-name" style={{ width: '220px' }}>{item.name}</div>
                                            <div className="cart-item-price" style={{ width: '70px' }}>{(item.price * item.quantity).toFixed(2)} €</div>
                                            <Button className="remove-cart-button" variant="link" onClick={() => removeItem(item.name)}>x</Button>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="cart-total">
                                        <div>Total price:</div>
                                        <div>{totalPrice.toFixed(2)} €</div>
                                    </div>
                                    <Space/>
                                    <div className="cart-buttons">
                                        <Button variant="outline" color="green" onClick={() => clearCart()} fullWidth="True">Clear cart</Button>
                                        <Space w={10} />
                                        {localStorage.getItem("ROLE")==="ROLE_USER" || localStorage.getItem("ROLE")==="ROLE_ADMIN" ? <Button component="a" href="/orders" variant="filled" color="green" onClick={() => checkout()} fullWidth="True">Checkout</Button> : <Button component="a" href="/login" color="green">Log in to buy</Button>}
                                    </div>
                                </>
                            )}
                        </div>
                    </Portal>
                )}
            </BrowserRouter>

        </MantineProvider>
    );
}
export default App;
