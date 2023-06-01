import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {Button, Group, Container, Paper, TextInput, Grid} from '@mantine/core'



const WineEdit = () => {

    const [id, changeID] = useState(0);
    const [year, changeYear] = useState(0);
    const [name, changeName] = useState('');
    const [description, changeDesc] = useState('');
    const [colour, changeCol] = useState('');
    const [taste, changeTaste] = useState('');
    const [region, changeRegion] = useState('');
    const [abv, changeAbv] = useState(0);
    const [price, changePrice] = useState(0);
    const [stockQuantity, changeQuantity] = useState(0);
    const wineID = useParams().id;

    const [wine, setWine] = useState({});
    const [hasError, setErrors] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/wines/${wineID}`);
            console.log()
            await response
                .json()
                .then(
                    (response) => {
                        changeYear(response.year)
                        changeName(response.name)
                        changeDesc(response.description)
                        changeCol(response.colour)
                        changeTaste(response.taste)
                        changeRegion(response.region)
                        changeAbv(response.abv)
                        changePrice(response.price)
                        changeQuantity(response.stockQuantity)
                    })
                .catch(err => setErrors(err));
        }
        if(wineID !== 'new') {
            fetchData()
        }
    }, []);



    const handleChange = ({target}) => {
        const {name, value} = target;
        setWine({...wine, [name]: value});
        console.log(wine);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const wineObj = {
            id,
            year,
            name,
            description,
            colour,
            taste,
            region,
            abv,
            price,
            stockQuantity
        };

        let pickMethod = '';
        let urlID = '';
        if(wineID !== 'new') {
            pickMethod = 'PUT';
            urlID = '/' + wineID;
        } else {
            pickMethod = 'POST';
            urlID = '';
        }
        fetch('/api/wines' + urlID, {
            method: pickMethod,
            headers: { "content-type": "application/json", "Authorization": `Bearer ${localStorage.getItem('TOKEN')}` },
            body: JSON.stringify(wineObj)
        }).then(() => {
            //console.log("data added");
            navigate(-1);
        }).catch((err) => {
            console.log(err.message);
        })
    }


    let title = '';
    if(wineID !== 'new') {
        title = <h2>Edit Wine</h2>
    } else {
        title = <h2>Add Wine</h2>
    }
    const container_size = 600;
    const x_margin = 20;
    // TODO: change number input to NumberInput instead of TextInput
    return (<div>
        <Container size={container_size} my={10} align="center">
            {title}
            <Paper withBorder shadow="md" p={x_margin} mt={20} radius="md">
                <form onSubmit={handleSubmit}>
                    <Container align="left">
                        <Group>
                            <TextInput name="name" id="name" value={name || ''}
                                       onChange={e => changeName(e.target.value)} placeholder="Wine name"
                                       required={true}
                                       label="Name"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="number" name="year" id="year" value={year || ''}
                                       onChange={e => changeYear(e.target.value)} autoComplete="year"
                                       required={true}
                                       placeholder="Year"
                                       label="Year"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="text" name="description" id="description"
                                       value={description || ''}
                                       onChange={e => changeDesc(e.target.value)} autoComplete="description"
                                       required={true}
                                       placeholder="Description"
                                       label="Description"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="text" name="colour" id="colour" value={colour || ''}
                                       onChange={e => changeCol(e.target.value)} autoComplete="colour"
                                       required={true}
                                       placeholder="Colour"
                                       label="Colour"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="text" name="taste" id="taste" value={taste || ''}
                                       onChange={e => changeTaste(e.target.value)} autoComplete="taste"
                                       required={true}
                                       placeholder="Taste"
                                       label="Taste"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="text" name="region" id="region" value={region || ''}
                                       onChange={e => changeRegion(e.target.value)} autoComplete="region"
                                       required={true}
                                       placeholder="Region"
                                       label="Region"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="number" name="abv" id="abv"
                                       defaultValue={abv || ''}
                                       onChange={e => changeAbv(e.target.value)}
                                       required={true}
                                       placeholder="ABV"
                                       label="ABV"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="number" name="price" id="price"
                                       value={price || ''}
                                       onChange={e => changePrice(e.target.value)} autoComplete="price"
                                       required={true}
                                       placeholder="Price"
                                       label="Price"
                                       w={container_size - x_margin}
                            />
                        </Group>
                        <Group mt={10}>
                            <TextInput type="number" name="stockQuantity" id="stockQuantity"
                                       value={stockQuantity || ''}
                                       onChange={e => changeQuantity(e.target.value)} autoComplete="stockQuantity"
                                       required={true}
                                       placeholder="Stock Quantity"
                                       label="Stock Quantity"
                                       w={container_size - x_margin}
                            />
                        </Group>

                        <Grid grow gutter="xs" mt={10}>
                            <Grid.Col span={1}>
                                <Button color="green" type="submit" fullWidth mt={10}>Save</Button>
                            </Grid.Col>
                            <Grid.Col span={1}>
                                <Button color="red" component="a" href="/wines" fullWidth mt={10}>Cancel</Button>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </form>
            </Paper>
        </Container>
    </div>)
};
export default WineEdit;