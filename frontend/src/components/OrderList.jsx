import React, { useState, useEffect } from "react";
import {Table, Button, Group} from '@mantine/core'
import {useDisclosure} from "@mantine/hooks";

const OrderList = () => {
    /**
     * @param body._embedded.orders  Spring stuff
     * @param order.userId            user ID
     * @param order.status            order status
     * @param order.date              date of creation
     * @param order.totalPrice
     * @param order.wineIds           IDs of ordered wines
     */

    const [hasError, setErrors] = useState(false);
    const [orders: [], setOrders] = useState([]);
    const currencyCode = "€"; // &#8364;
    const [opened, { open, close }] = useDisclosure(false);
    const [wines: [], setWines] = useState([]);
    const [user , setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/orders',{ headers: { "Authorization": `Bearer ${localStorage.getItem('TOKEN')}` }});
            await response
                .json()
                .then(body => setOrders(body._embedded.orders))
                .catch(err => setErrors(err));
        }
        async function fetchWines() {
            const res = await fetch('/api/wines');
            await res
                .json()
                .then(body => setWines(body._embedded.wines))
                .catch(err => setErrors(err));
        }
        async function fetchUsers() {
            const res = await fetch('/api/users',{ headers: { "Authorization": `Bearer ${localStorage.getItem('TOKEN')}` }});
            await res
                .json()
                .then(body => setUsers(body._embedded.user))
                .catch(err => setErrors(err));
        }
        fetchData()
        fetchWines()
        fetchUsers()
    }, []);

    function addWineStock(id, count) {
        const request = {
            id: id,
            count: count
        };

        return fetch('/api/addWineStock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem('TOKEN')}`  },
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
    function actionButtons(order, lines) {
        if (localStorage.getItem("ROLE")==='ROLE_ADMIN') {
            return (
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{order.date.slice(0, 10)}</td>
                    <td>{order.totalPrice} €</td>
                    <td>{lines}</td>
                    <td>{order.status}</td>
                    <td>
                        <Group spacing={10} >
                            <Button component="a" href={"/orders/" + order.id}
                                    color="blue">Manage</Button>
                            <Button component="a" color="red"
                                    onClick={() => remove(order.id)}>Delete</Button>
                        </Group>
                    </td>
                </tr>
            )
        } else  if (localStorage.getItem("ROLE")==='ROLE_USER'){
            if (order.userId.toString() === localStorage.getItem('ID').toString()) {
                return (
                    <tr key={order.id}>
                        <td>{order.id}</td>

                        <td>{order.date.slice(0, 10)}</td>
                        <td>{order.totalPrice} €</td>
                        <td>{lines}</td>
                        <td>{order.status}</td>
                    </tr>
                )
            } else return (<></>)
        }
    }

    function showUserID() {
        if (localStorage.getItem("ROLE")==='ROLE_ADMIN') {
            return (
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Wines</th>
                    <th>Status</th>
                </tr>
            )
        }  else  if (localStorage.getItem("ROLE")==='ROLE_USER'){
            return (
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Wines</th>
                    <th>Status</th>
                </tr>
            )
        }

    }


    async function remove(id) {
        if (window.confirm("Remove order " + id + "?")) {
            await fetch(`/api/orders/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('TOKEN')}`
                    }
                }).then(() => {
                    window.location.reload();
                }).catch((err) => {
                    console.log(err.message)
                })
        }
        let wineIds = orders.find(order => order.id === id).wineIds;
        let quantities = orders.find(order => order.id === id).quantities;

        for (let i = 0; i < wineIds.length; i++) {
            addWineStock(wineIds[i], quantities[i]);
        }
    }

    return (
        <>
        {localStorage.getItem('ROLE')==='ROLE_ADMIN' ? <Button component="a" href='/orders/new/' color="green">New order</Button> : <></>}

            <Table horizontalSpacing="md" verticalSpacing="sm" fontSize="md">
                <thead>
                {showUserID()}
                </thead>
                <tbody>
                {
                    orders.map(
                        order => {
                            const orderNames = [];
                            let idx = 0;
                            order.wineIds.forEach(id => wines.forEach(wine => { if (id === wine.id) { orderNames.push(wine.name + ' (id: ' + id + ')') } }));
                            //orders.id.forEach(order => orderUser = order.userId);
                            for (idx; idx < orderNames.length; idx++) {
                                orderNames[idx] = orderNames[idx] + ' x' + order.quantities[idx];
                            }
                            let lines = orderNames.map(name => <div>{name}</div>);
                            return (
                                actionButtons(order, lines)
                            )
                        }
                    )
                }
                </tbody>
            </Table>
        </>
    );
};
export default OrderList;