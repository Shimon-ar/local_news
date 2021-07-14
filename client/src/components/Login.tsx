import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { RouteComponentProps } from 'react-router-dom'
import { shadows } from '@material-ui/system';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Routes } from '../types';
import { UserContext } from '../context/UserContext';




const useStyles = makeStyles({
    root: {
        // backgroundImage: "url('/color.jpg')",
        minWidth: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // backgroundSize: 'cover'


    },
    paper: {
        backgroundColor: '#f6f6f8',
        flexDirection: "column",
        textAlign: 'center',
        paddingLeft: '60px',
        paddingRight: '60px',
        paddingTop: '45px',
        alignItems: "center",
        paddingBottom: '100px'
    },
    grid: {
        textAlign: 'center',
    },
    mainLabel: {
        fontWeight: 700,
        fontSize: '35px',
        marginBottom: '30px'
    },

    buttuns: {
        direction: 'rtl',
        flexDirection: 'row',
        marginTop: '40px'

    },
    button: {
        // backgroundImage: "url('/blue.jpg')",
        height: '40px',
        fontSize: '16px',
        fontWeight: 'bolder'
        // color: 'white',
        // '&:hover': {
        //     color: 'white',
        // }

    },
    label: {
        direction: 'rtl',
        fontWeight: 'bold',
        fontSize: '18px',
        marginTop: '15px'

    },
    boxButton: {
        display: 'inline-block'
    },
    dialog: {
        alignSelf: 'center'
    },
    alert: {
        backgroundColor: 'inherit',

    }
})

interface error {
    username: boolean,
    password: boolean
}

enum routeType {
    login = '/login', createUser = '/createUser'
}


const Login: FunctionComponent<RouteComponentProps> = (props) => {
    const classes = useStyles();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<error>({ username: false, password: false });
    const [openDialog, setOpenDialog] = useState<{ open: boolean, text: string }>({ open: false, text: '' });
    const userContext = useContext(UserContext);



    const clearForm = () => {
        setPassword('');
        setUsername('');
    }

    const validate = () => {
        setErrors({
            username: username === '',
            password: password === ''
        })
        return username != '' && password != '';
    }

    const onSubmit = (route: string) => {
        if (!validate())
            return;

        const data = new FormData();
        data.append('username', username);
        data.append('password', password);

        sendPost(data, route);
    }

    const onCloseDialog = () => {
        setOpenDialog({ open: false, text: '' });
    }


    const sendPost = (data: FormData, route: string) => {
        if (!data)
            return;

        fetch(route, {
            method: 'POST',
            body: data,
        }).then((response) => {
            if (response.ok) {
                
                response.json().then((data) => {
                    userContext?.setUser({name: data.name, id: data.id, is_manager:data.is_manager})
                    props.history.push(Routes.home);

                })
                
            }
            else if (response.status == 404 && route === routeType.login) {
                setOpenDialog({ open: true, text: 'שם משתמש או סיסמא לא נכונים' });
            }

            else if (response.status == 404 && route === routeType.createUser) {
                setOpenDialog({ open: true, text: 'שם משתמש קיים' });
            }

            else if (response.status == 401 && route === routeType.createUser) {
                setOpenDialog({ open: true, text: 'שגיאה במסד הנתונים' });

            }

        }).catch((e) => {
            console.log(e)
            setOpenDialog({ open: true, text: '.שגיאת מערכת' })
        });
    }


    return (

        <div className={classes.root}>


            <Grid container justify='center'>
                <Grid item className={classes.grid} >
                    <Box className={classes.paper} borderRadius={16} boxShadow={24} >
                        <Typography variant='h6' className={classes.mainLabel}>
                            חדשות מקומיות
                        </Typography>


                        <Typography className={classes.label} >
                            שם משתמש:
                        </Typography>

                        <TextField variant='outlined' size='small' id="username" dir='rtl'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            inputProps={{ style: { fontSize: '1.2rem' } }} />
                        {errors.username ? <Alert className={classes.alert} dir='rtl' severity="error">שדה חובה</Alert> : <div></div>}

                        <Typography className={classes.label}>
                            סיסמא:
                        </Typography>

                        <TextField variant='outlined' size='small' id="password" dir='rtl'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            inputProps={{ style: { fontSize: '1.2rem', direction: 'rtl' } }} />
                        {errors.password ? <Alert className={classes.alert} dir='rtl' severity="error">שדה חובה</Alert> : <div></div>}

                        <Box className={classes.buttuns}>
                            <Box marginLeft={2} className={classes.boxButton}>
                                <Button
                                    onClick={() => onSubmit(routeType.login)}
                                    dir='rtl' variant={'outlined'} className={classes.button}>כניסה</Button>
                            </Box>
                            <Box className={classes.boxButton}>
                                <Button
                                    onClick={() => onSubmit(routeType.createUser)}
                                    dir='rtl' variant={'outlined'} className={classes.button}>משתמש חדש</Button>
                            </Box>
                        </Box>

                    </Box>
                </Grid>
            </Grid>



            <Dialog
                dir='rtl'

                open={openDialog.open}
                onClose={() => onCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {openDialog.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.dialog}>
                    <Button onClick={onCloseDialog} color="primary">
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Login;