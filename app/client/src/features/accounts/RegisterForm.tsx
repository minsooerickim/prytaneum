/* eslint-disable react/jsx-curly-newline */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, InputAdornment, Grid, Divider, Avatar, Typography } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// import AccountCirlceOutline from '@material-ui/icons/AccountCircleOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { graphql, useMutation } from 'react-relay';

import type { RegisterFormMutation } from '@local/__generated__/RegisterFormMutation.graphql';
import { Form } from '@local/components/Form';
import { FormContent } from '@local/components/FormContent';
import { TextField } from '@local/components/TextField';
import { LoadingButton } from '@local/components/LoadingButton';
import { useUser } from '@local/features/accounts';
import { useSnack, useForm } from '@local/features/core';

interface Props {
    onSuccess: () => void;
    onFailure: () => void;
    secondaryActions?: React.ReactNode;
}

const initialState = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
};

export type TRegisterForm = typeof initialState;

const useStyles = makeStyles((theme) => ({
    btnGroup: {
        '& > *': {
            margin: theme.spacing(1, 0),
        },
    },
    divider: {
        width: '75%',
        marginLeft: '12.5%',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(4),
    },
}));
const REGISTER_FORM_MUTATION = graphql`
    mutation RegisterFormMutation($input: RegistrationForm!) {
        register(input: $input) {
            isError
            message
            body {
                ...useUserFragment
            }
        }
    }
`;
export function RegisterForm({ onSuccess, onFailure, secondaryActions }: Props) {
    // form state hooks
    const [isPassVisible, setIsPassVisible] = React.useState(false);
    const [form, errors, handleSubmit, handleChange] = useForm(initialState);
    const [commit, isLoading] = useMutation<RegisterFormMutation>(REGISTER_FORM_MUTATION);

    // styling hook
    const classes = useStyles();

    // request hook
    // const

    const [, setUser] = useUser();

    // user feedback
    const { displaySnack } = useSnack();

    function handleCommit(submittedForm: TRegisterForm) {
        commit({
            variables: { input: submittedForm },
            onCompleted({ register }) {
                if (register.isError) {
                    displaySnack(register.message);
                    if (onFailure) onFailure();
                } else {
                    setUser(register.body);
                    if (onSuccess) onSuccess();
                }
            },
            onError: onFailure,
        });
    }

    return (
        <Grid container justify='center'>
            <Grid container item xs={12} direction='column' alignItems='center'>
                {/* <Avatar className={classes.avatar}>
                    <AccountCirlceOutline />
                </Avatar> */}
                <Typography component='h1' variant='h6'>
                    Register
                </Typography>
            </Grid>
            <Form className={classes.form} onSubmit={handleSubmit(handleCommit)}>
                <FormContent>
                    <TextField
                        id='register-first-name'
                        helperText={errors.firstName}
                        required
                        value={form.firstName}
                        onChange={handleChange('firstName')}
                        label='First Name'
                        autoFocus
                        error={Boolean(errors.firstName)}
                    />
                    <TextField
                        id='register-last-name'
                        helperText={errors.lastName}
                        required
                        value={form.lastName}
                        onChange={handleChange('lastName')}
                        label='Last Name'
                        error={Boolean(errors.lastName)}
                    />
                    <TextField
                        id='register-email'
                        // eslint-disable-next-line quotes
                        helperText={errors.email || "We'll never share your email"}
                        required
                        type='email'
                        value={form.email}
                        onChange={handleChange('email')}
                        label='Email'
                        error={Boolean(errors.email)}
                    />
                    <TextField
                        id='register-password'
                        required
                        error={Boolean(errors.password)}
                        helperText={errors.password || 'Passwords must be at least 8 characters'}
                        type={isPassVisible ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange('password')}
                        label='Password'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={() => setIsPassVisible(!isPassVisible)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge='end'
                                    >
                                        {isPassVisible ? (
                                            <VisibilityOff color={errors.password ? 'error' : undefined} />
                                        ) : (
                                            <Visibility color={errors.password ? 'error' : undefined} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        id='register-confirm-password'
                        required
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                        type={isPassVisible ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        label='Confirm Password'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={() => setIsPassVisible(!isPassVisible)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge='end'
                                    >
                                        {isPassVisible ? (
                                            <VisibilityOff color={errors.confirmPassword ? 'error' : undefined} />
                                        ) : (
                                            <Visibility color={errors.confirmPassword ? 'error' : undefined} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormContent>
                <Grid container item direction='column' className={classes.btnGroup}>
                    <LoadingButton loading={isLoading}>
                        <Button fullWidth type='submit' variant='contained' color='secondary'>
                            Register
                        </Button>
                    </LoadingButton>
                    {secondaryActions && (
                        <>
                            {/* <Divider className={classes.divider} /> */}
                            {secondaryActions}
                        </>
                    )}
                </Grid>
            </Form>
        </Grid>
    );
}

RegisterForm.defaultProps = {
    onFailure: null,
};

RegisterForm.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func,
};