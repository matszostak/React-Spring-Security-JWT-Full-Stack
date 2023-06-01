import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {Table, Button, Container, Paper, Grid, Title, Center} from '@mantine/core'



const WineInfo = () => {

    const [wine, setWine] = useState([]);
    const wineID = useParams().id;

    const currencyCode = "€"; // &#8364;

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`/api/wines/${wineID}`);
            console.log()
            await response
                .json()
                .then(
                    (response) => {
                        setWine(response)
                    })
        }
        fetchData()
    }, []);


    // TODO: change number input to NumberInput instead of TextInput
    return (<div>
        <Center>
            <Grid columns={24} spacing="sm" w={1200} h={400} >
                <Grid.Col span={6}>
                    <Paper h="100%">
                        <Container my={10} align="left">
                            Image
                        </Container>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Paper h="100%">
                        <Container my={10} align="left">
                            <Title>{wine.name}</Title>
                            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                                Add to cart
                            </Button>
                            <Container align="left">
                                {wine.description}
                            </Container>
                        </Container>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Paper h="100%">
                        <Container my={10} align="left">
                            <Table withBorder withColumnBorders verticalSpacing="xs" my={10}>
                                <tbody>
                                    <tr>
                                        <th>Year</th>
                                        <td>{wine.year}</td>
                                    </tr>
                                    <tr>
                                        <th>Colour</th>
                                        <td>{wine.colour}</td>
                                    </tr>
                                    <tr>
                                        <th>Taste</th>
                                        <td>{wine.taste}</td>
                                    </tr>
                                    <tr>
                                        <th>Region</th>
                                        <td>{wine.region}</td>
                                    </tr>
                                    <tr>
                                        <th>ABV</th>
                                        <td>{wine.abv}%</td>
                                    </tr>
                                </tbody>

                            </Table>
                        </Container>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Center>
    </div>)
};
export default WineInfo;