import { useState } from 'react';
import {
    createStyles,
    Table,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    Button,
    rem,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import useWineCartState from '../state/wineCartState.js';

const useStyles = createStyles((theme) => ({
    th: {
        padding: '0 !important',
    },

    control: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    icon: {
        width: rem(21),
        height: rem(21),
        borderRadius: rem(21),
    },
}));

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

interface RowData {
    id: number;
    name: string;
    year: number;
    region: string;
    abv: number;
    description: string;
    colour: string;
    taste: string;
    price: number;
    stockQuantity: number;
}

interface TableSortProps {
    data: RowData[];
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

function TableHeader({ children, reversed, sorted, onSort }: ThProps) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <th className={classes.th}>
        <UnstyledButton onClick={onSort} className={classes.control}>
    <Group position="apart">
    <Text fw={500} fz="sm">
        {children}
        </Text>
        <Center className={classes.icon}>
    <Icon size="0.9rem" stroke={1.5} />
    </Center>
    </Group>
    </UnstyledButton>
    </th>
);
}

function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => item[key].toString().toLowerCase().includes(query))
    );
}

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    if (sortBy === 'id' || sortBy === 'price' || sortBy === 'abv' || sortBy === 'year' || sortBy === 'stockQuantity' ) {
        if (payload.reversed) {
            return filterData([...data].sort((a, b) => b[sortBy] - a[sortBy]), payload.search)
        } else {
            return filterData([...data].sort((a, b) => a[sortBy] - b[sortBy]), payload.search)
        }

    } else {
        return filterData(

            [...data].sort((a, b) => {
                if (payload.reversed) {
                    return b[sortBy].toString().localeCompare(a[sortBy].toString());
                }

                return a[sortBy].toString().localeCompare(b[sortBy].toString());
            }),
            payload.search
        );
    }


}

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

export function TableSort({ data }: TableSortProps) {
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const { winesCart, addItem, removeItem, clearCart, calculateTotalPrice } = useWineCartState();

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    /**
     * @param body._embedded.wines  Spring stuff
     * @param wine.description      wine description
     * @param wine.colour           wine colour
     * @param wine.taste            wine taste
     * @param wine.path           wine path
     * @param wine.price            wine price
     * @param wine.stockQuantity    stock quantity
     */
    const currencyCode = "€"; // &#8364;

    const handleAddToCart = (wine) => {
        const item = {
            id: wine.id,
            name: wine.name,
            quantity: 1,
            price: wine.price,
        };
        addItem(item);
    };
    function actionButtons(id, wine) {
        if (localStorage.getItem("ROLE")=='ROLE_ADMIN') {
            return (
                <Group spacing={10}>
                    <Button component="a" href={"/wines/" + id}
                            color="blue" size="xs">Edit</Button>
                    <Button component="a" color="red" size="xs"
                            onClick={() => remove(id)}>Delete</Button>
                </Group>
            )
        } else {
            return (
                <Group spacing={10}>
                    <Button component="a"
                            color="blue" size="xs" onClick={() => handleAddToCart(wine)}>Add to cart</Button>
                </Group>
            )
        }
    }


    const rows = sortedData.map((row) => (
        <tr key={row.name}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.year}</td>
            <td>{row.abv}</td>
            <td>{row.description}</td>
            <td>{row.colour}</td>
            <td>{row.taste}</td>
            <td>{row.region}</td>
            <td>{row.price} {currencyCode}</td>
            <td>{row.stockQuantity}</td>
            <td>
                {actionButtons(row.id, row)}
            </td>
            </tr>
    ));

    return (
        // @ts-ignore
        <>
            {localStorage.getItem("ROLE") === 'ROLE_ADMIN' ? <Button component="a" href='/wines/new/' color="green">Add wine</Button> : <></>}
            <TextInput
                placeholder="Search by any field"
    mb="md"
    icon={<IconSearch size="0.9rem" stroke={1.5} />}
    value={search}
    onChange={handleSearchChange}
    />
    <Table horizontalSpacing="md" verticalSpacing="md" miw={700} sx={{ tableLayout: 'fixed' }}>
    <thead>
        <tr>
            <TableHeader
                sorted={sortBy === 'id'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('id')}

            >
                ID
            </TableHeader>
            <TableHeader
                sorted={sortBy === 'name'}
    reversed={reverseSortDirection}
    onSort={() => setSorting('name')}

>
    Name
    </TableHeader>

    <TableHeader
    sorted={sortBy === 'year'}
    reversed={reverseSortDirection}
    onSort={() => setSorting('year')}
>
    Year
    </TableHeader>

    <TableHeader
    sorted={sortBy === 'abv'}
    reversed={reverseSortDirection}
    onSort={() => setSorting('abv')}
>
    ABV
    </TableHeader>

            <TableHeader
                sorted={sortBy === 'description'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('description')}
            >
                Description
            </TableHeader>

            <TableHeader
                sorted={sortBy === 'colour'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('colour')}
            >
                Colour
            </TableHeader>

            <TableHeader
                sorted={sortBy === 'taste'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('taste')}
            >
                Taste
            </TableHeader>

            <TableHeader
                sorted={sortBy === 'region'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('region')}
            >
                Region
            </TableHeader>

            <TableHeader
                sorted={sortBy === 'price'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('price')}
            >
                Price
            </TableHeader>

            <TableHeader
                sorted={sortBy === 'stockQuantity'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('stockQuantity')}
            >
                Stock Quantity
            </TableHeader>
            <th>
                Actions
            </th>
    </tr>
    </thead>
    <tbody>
    {rows.length > 0 ? (
            rows
        ) : (
            <tr>
                <td colSpan={Object.keys(data[0]).length}>
            <Text weight={500} align="center">
        Nothing found
            </Text>
    </td>
    </tr>
)}
    </tbody>
    </Table>
    </>
);
}