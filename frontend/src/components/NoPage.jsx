import {
    createStyles,
    Title,
    Text,
    Container,
    Group, Anchor,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    label: {
        textAlign: "center",
        fontSize: 200,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[4],

        [theme.fn.smallerThan("sm")]: {
            fontSize: 120,
        },
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.gray[5],
    },
    desc: {
        textAlign: "center",
        fontSize: 16,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[8],
    },
    desc_link: {
        textAlign: "center",
        fontSize: 16,
    },
}));

export default function NotFoundTitle() {
    const { classes } = useStyles();

    return (
        <Container my={60}>
            <Title className={classes.label}>Error 404</Title>
            <Title className={classes.title}>Page not found.</Title>
            <Group position="center" mt={20}>
                <Text className={classes.desc}>
                    The page you are looking for doesn't exist.{' '}
                    <Anchor href="/" className={classes.desc_link}>
                        Go back to home page.
                    </Anchor>
                </Text>
            </Group>
        </Container>
    );
}