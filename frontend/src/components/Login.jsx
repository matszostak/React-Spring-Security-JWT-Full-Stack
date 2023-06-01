import { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
} from '@mantine/core';
import AuthService from "../state/AuthService";
import {useNavigate} from "react-router-dom";


export function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        const credentials = {
            login: login,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:55555/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                setLoginSuccess(true);
                await response
                    .json()
                    .then(
                        (response) => {
                            console.log(response.login)
                            console.log(response.token)
                            AuthService.registerSuccessfulLoginForJwt(response.id, response.login, response.token, response.role)
                        })
                    .catch();
                navigate(-1)
            } else {
                setLoginSuccess(false)
                alert('Login failed');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Login failed');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Welcome back!
            </Title>

            <Paper withBorder shadow="md" p={20} mt={30} radius="md">
                <TextInput
                    label="Username"
                    placeholder="Username"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    required
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    mt="md"
                />

                <Button fullWidth mt={30} onClick={handleLogin}>
                    Sign in
                </Button>

                {loginSuccess && (
                    <Text color="green" size="sm" align="center" mt={10}>
                        Login successful!
                    </Text>
                )}
            </Paper>

            <Text color="dimmed" size="sm" align="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor href="/register">
                    Create account
                </Anchor>
            </Text>
        </Container>
    );
}
