import React, { useState, useEffect } from "react";
import {Table, Button, Group} from '@mantine/core'
import {useDisclosure} from "@mantine/hooks";
import {TableSort} from "./SortWines.tsx";

const WineList = () => {
    /**
     * @param body._embedded.wines  Spring stuff
     * @param wine.name             wine name
     * @param wine.year             year of production
     * @param wine.abv              alcohol content
     * @param wine.description      wine description
     * @param wine.colour           wine colour
     * @param wine.taste            wine taste
     * @param wine.path           wine path
     * @param wine.price            wine price
     * @param wine.stockQuantity    stock quantity
     */

    const [hasError, setErrors] = useState(false);
    const [wines: [], setWines] = useState([]); // ??? why is this an error???
    const currencyCode = "€"; // &#8364;
    const [opened, { open, close }] = useDisclosure(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/wines');
            await response
                .json()
                .then(body => setWines(body._embedded.wines))
                .catch(err => setErrors(err));
        }
        fetchData().finally(setLoading(false))

    }, []);

    async function remove(id) {
        if(window.confirm("Remove wine " + id + "?")){
            await fetch(`/api/wines/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('TOKEN')}`
                    }
                }).then(()=>{
                window.location.reload();
            }).catch((err)=>{
                console.log(err.message)
            })
        }
    }

    // <Button component="a" color="green" href={"/wines/new"}>Add Wine</Button> <--- this is a modal now

    // TODO: Make edit wine a modal?
    if (wines && wines.length) {
        return <TableSort data={wines} />
    } else {
    return (
        <>
            <Button component="a" href='/wines/new/' color="green">Add wine</Button>

            <Table horizontalSpacing="md" verticalSpacing="sm" fontSize="md">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Region</th>
                    <th>Colour</th>
                    <th>Taste</th>
                    <th>ABV</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock quantity</th>
                    <th>Options</th>
                </tr>
                </thead>
                <tbody>
                {
                    wines.map(
                        wine => {
                            return (
                                <tr key={wine.id}>
                                    <td>{wine.id}</td>
                                    <td>{wine.name}</td>
                                    <td>{wine.year}</td>
                                    <td>{wine.region}</td>
                                    <td>{wine.colour}</td>
                                    <td>{wine.taste}</td>
                                    <td>{wine.abv}%</td>
                                    <td>{wine.description}</td>
                                    <td>{wine.price}{currencyCode}</td>
                                    <td>{wine.stockQuantity}</td>
                                    <td>
                                        <Group spacing={10} >
                                            <Button component="a" href={"/wines/" + wine.id}
                                                    color="blue">Edit</Button>
                                            <Button component="a" color="red"
                                                    onClick={() => remove(wine.id)}>Delete</Button>
                                        </Group>
                                    </td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
            </Table>

        </>


    );
    }
};
export default WineList;