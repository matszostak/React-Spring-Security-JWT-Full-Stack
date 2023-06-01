import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Group, Container, Paper, TextInput, Grid} from '@mantine/core'



const OrderEdit = () => {

    const [id, changeID] = useState(0);
    const [status, changeStatus] = useState('');
    const [userId, changeUserId] = useState(0);
    const [date, changeDate] = useState('');
    const [totalPrice, changeTotalPrice] = useState(0);
    const [wineIds, changeWineIds] = useState([]);
    const orderID = useParams().id;
    const [wines, changeWines] = useState('');
    const [TMPID, setTMPID] = useState([]);
    const [TMPQ, setTMPQ] = useState([]);
    const [qTxt, changeQtxt] = useState('');
    const [quantities, changeQuantities] = useState([]);


    const [order, setOrder] = useState({});
    const [hasError, setErrors] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/orders/${orderID}`,{ headers: {"Authorization": `Bearer ${localStorage.getItem('TOKEN')}` }});
            console.log()
            await response
                .json()
                .then(
                    (response) => {
                        changeStatus(response.status)
                        changeUserId(response.userId)
                        changeDate(response.date.slice(0,10))
                        changeWineIds(response.wineIds)
                        setTMPID(response.wineIds)
                        var vals = ''
                        wineIds.forEach((el) => { vals = vals + el + "," })
                        changeWines(vals)
                        changeQuantities(response.quantities)
                        setTMPQ(response.quantities)
                        var q = ''
                        quantities.forEach((el) => {q = q+el+"," })
                        changeQtxt(q)
                        changeTotalPrice(response.totalPrice)
                    })
                .catch(err => setErrors(err));
        }
        if(orderID !== 'new') {
            fetchData()
        }
    }, []);



    const handleChange = ({target}) => {
        const {name, value} = target;
        setOrder({...order, [name]: value});
        console.log(order);
    };

    async function countTotalPrice(w, q) {
        let total = 0;
        let response, prices = [];
        for (let wineNr = 0; wineNr < w.length; wineNr++) {
            response = await fetch(`/api/wines/${w[wineNr]}`);
            await response.json().then((response) => {
                prices[wineNr] = response.price;
            });
        }
        for (let i = 0; i < w.length; i++) {
            total += q[i] * prices[i];
        }
        return total;
    }

    function removeWineStock(id, count) {
        const request = {
            id: id,
            count: count
        };

        return fetch('/api/removeWineStock', {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        var wineIds = [];
        wines.split(",").forEach((el) => { wineIds.push(+el) });
        if (orderID !== 'new') {
            wineIds = TMPID;
        }
        var quantities = [];
        qTxt.split(",").forEach(q => { quantities.push(+q) });
        if (orderID !== 'new') {
            quantities = TMPQ;
        }

        for (let i = 0; i < wineIds.length; i++) {
            removeWineStock(wineIds[i], quantities[i]);
        }

        const totalPrice = await countTotalPrice(wineIds, quantities);
        console.log(totalPrice);
        const orderObj = {
            id,
            status,
            userId,
            date,
            quantities,
            totalPrice,
            wineIds
        };

        let pickMethod = '';
        let urlID = '';
        if(orderID !== 'new') {
            pickMethod = 'PUT';
            urlID = '/' + orderID;
        } else {
            pickMethod = 'POST';
            urlID = '';
        }
        fetch('/api/orders' + urlID, {
            method: pickMethod,
            headers: { "content-type": "application/json", "Authorization": `Bearer ${localStorage.getItem('TOKEN')}`  },
            body: JSON.stringify(orderObj)
        }).then(() => {
            console.log("data added");
            navigate(-1);
        }).catch((err) => {
            console.log(err.message);
        })
    }


    let title = '';
    if(orderID !== 'new') {
        title = <h2>Edit Order</h2>
    } else {
        title = <h2>Add Order</h2>
    }
    const container_size = 600;
    const x_margin = 20;
    // TODO: change state input to list containing allowed enums
    return (<div>
        <Container size={container_size} my={10} align="center">
            {title}
            <Paper withBorder shadow="md" p={x_margin} mt={20} radius="md">
                <form onSubmit={handleSubmit}>
                    <Container align="left">
                        <Group>
                            <TextInput type="number" name="userId" id="userId" value={userId || ''}
                                onChange={e => { if (orderID === 'new') { changeUserId(e.target.value) } } } placeholder="User Id"
                                       required={true}
                                       label="userID"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="text" name="date" id="date" value={date || ''} required pattern="\d{4}-\d{2}-\d{2}"
                                onChange={e => { if (orderID==='new') { changeDate(e.target.value) } }} autoComplete="Date"
                                       required={true}
                                       placeholder="date: yyyy-mm-dd"
                                       label="date"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        {orderID == 'new' && (<Group mt={10}>
                            <TextInput type="text" name="quantities" id="quantities" value={qTxt || ''}
                                onChange={e => changeQtxt(e.target.value)} autoComplete="Quantites"
                                required={true}
                                placeholder="q1,q2,..."
                                label="quantities"
                                w={container_size - x_margin}
                            />
                        </Group>)}
                        {orderID == 'new' && (<Group mt={10}>
                            <TextInput type="text" name="wines" id="wines" value={wines || ''}
                                onChange={e => changeWines(e.target.value)} autoComplete="wines"
                                required={true}
                                placeholder="wines"
                                label="wines"
                                w={container_size - x_margin}
                            />
                        </Group>)}
   
                        {orderID != 'new' && (<Group mt={10}>
                            <div>Status</div>
                            <select
                                label="Status"
                                type="select"
                                dropdown
                                onChange={e => changeStatus(e.target.value)}
                                w={container_size - x_margin}
                                >
                                <option value="-----">------</option>
                                <option value="ORDERED">ORDERED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="READY">READY</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </Group>)}

                        <Grid grow gutter="xs" mt={10}>
                            <Grid.Col span={1}>
                                <Button color="green" type="submit" onClick={e => { if (orderID == 'new') { changeStatus("ORDERED") } } } fullWidth mt={10}>Save</Button>
                            </Grid.Col>
                            <Grid.Col span={1}>
                                <Button color="red" component="a" href="/orders" fullWidth mt={10}>Cancel</Button>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </form>
            </Paper>
        </Container>
    </div>)
};
export default OrderEdit;