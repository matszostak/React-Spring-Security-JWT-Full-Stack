import { useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Text,
    Container,
    Button,
} from '@mantine/core';

import {useNavigate} from "react-router-dom";
import AuthService from "../state/AuthService";

export function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password === "" || username === "" || email === ""){
            alert('All fields must be filled out!');
            return;
        }

        const newUser = {
            email: email,
            login: username,
            password: password
        };

        try {
            async function fetchData() {
                const response = await fetch(`http://localhost:55555/register`,
                    {
                        method: 'POST',
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(newUser)
                    }

                );
                if(response.ok) {
                    setRegistrationSuccess(true)
                    await response
                        .json()
                        .then(
                            (response) => {
                                // console.log(response.login)
                                // console.log(response.token)
                                AuthService.registerSuccessfulLoginForJwt(response.id, response.login, response.token, response.role)
                            })
                        .catch();
                    navigate(-1)
                } else {
                    setRegistrationSuccess(false)
                    alert('Registration failed');
                }

            }
            fetchData()
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Create new account
            </Title>

            <Paper withBorder shadow="md" p={20} mt={30} radius="md">
                <TextInput
                    label="Username"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />
                <TextInput
                    label="Email"
                    placeholder="E-mail address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    mt="md"
                />
                <PasswordInput
                    label="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    mt="md"
                />
                <PasswordInput
                    label="Re-enter password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    mt="md"
                />

                <Button fullWidth mt="xl" onClick={handleRegister}>
                    Sign up
                </Button>

                {registrationSuccess && (
                    <Text color="green" size="sm" align="center" mt={10}>
                        Registration successful! Please proceed to log in.
                    </Text>
                )}
            </Paper>
        </Container>
    );
}
