import React, {useEffect, useState} from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    Badge,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Group,
    Image,
    SimpleGrid, Space,
    Text,
    Title
} from "@mantine/core";
import logo from "../logo.svg";
import useWineCartState from './../state/wineCartState';


const Home = () => {

    const [hasError, setErrors] = useState(false);
    const [wines, setWines] = useState([]);
    const [randomWines, setrandomWines] = useState([]);
    const [opened, {open, close}] = useDisclosure(false);
    const { winesCart, addItem, removeItem, clearCart, calculateTotalPrice } = useWineCartState();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/wines');
            await response
                .json()
                .then(body => setWines(body._embedded.wines))
                .catch(err => setErrors(err));
            const randomWinesRespons = await fetch('api/randomwines');
            await randomWinesRespons
                .json()
                .then(body => setrandomWines(body))
                .catch(err => setErrors(err));
        }

        fetchData()
    }, []);

    const handleAddToCart = (wine) => {
        const item = {
            id: wine.id,
            name: wine.name,
            quantity: 1,
            price: wine.price,
        };
        addItem(item);
    };

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

        useEffect(() => {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return windowDimensions;
    }

    const { height, width } = useWindowDimensions();

    const margin = 120;

    const columns = Math.round((0.9 * (width - margin)) / 320);

    const cardWidth = Math.min(((0.9 * (width - margin)) / columns), 320);

    const currencyCode = "€"; // &#8364;

    function mapWines(winesToMap, areRandom: boolean) {
        var color;
        if (areRandom) {

        } else {
            color =  color="#FC03F8"
        }
        if (winesToMap.length && winesToMap) {
            return winesToMap.map(
                wine => {
                    return (
                        <Card shadow="sm" padding="lg" radius="md" withBorder
                              w={cardWidth} key={wine.id}
                        >
                            <Center>
                                <Card.Section>
                                    <Image
                                        src={logo}
                                        width="100"
                                        height="120"
                                    />
                                </Card.Section>
                            </Center>

                            <Group position="apart" mt="md" mb="xs">
                                {

                                }
                                <Text
                                    fw={700} fz="lg" sx={{ fontFamily: 'Greycliff CF, sans-serif' }} lineClamp={1} w={150}
                                    component="a" href={`/viewwine/${wine.id}`}
                                >{wine.name}</Text>
                                <Badge color="red" variant="light" w={100}>
                                    On Sale
                                </Badge>

                            </Group>
                            <Text size="sm" color="dimmed">
                                {wine.desc}
                            </Text>
                            <Text size="sm" color="dimmed">
                                Taste: {wine.taste}
                            </Text>
                            <Text size="sm" color="dimmed">
                                Region: {wine.region}
                            </Text>
                            <Text size="sm" color="dimmed">
                                ABV: {wine.abv}{'%'}
                            </Text>
                            <Text size="sm">
                                Price: {wine.price}{' '}{currencyCode}
                            </Text>

                            <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => handleAddToCart(wine)}>
                                Buy now
                            </Button>
                        </Card>
                    )
                }
            )
        }

    }

    // TODO: show random wines or something
    return (
        <>
            <Center>
                <Container size={width - margin} px="xs">
                    <Title order={1}>Recommended wines:</Title>

                    <SimpleGrid cols={columns} spacing="sm" verticalSpacing="sm">
                        {
                            mapWines(randomWines)
                        }
                    </SimpleGrid>
                    <Space h="lg" />
                    <Divider size="xl" orientation="horizontal" />
                    <Title order={1}>Our wines:</Title>
                    <SimpleGrid cols={columns} spacing="sm" verticalSpacing="sm">
                        {
                            mapWines(wines)
                        }
                    </SimpleGrid>
                </Container>
            </Center>
        </>
    );

}
export default Home;