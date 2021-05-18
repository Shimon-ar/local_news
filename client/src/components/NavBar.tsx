import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Routes } from '../types';
import ButtonBase from '@material-ui/core/ButtonBase';


import { History } from 'history';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            paddingBottom: '60px',
            background: 'transparent',
            boxShadow: 'none'
        },
        menuButton: {
            paddingRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        buttons: {
            padding: '0px 10px 0px 10px',
            fontSize: '20px',
            border: 'solid',
            margin: '5px'



        },
 
        



    }),
);


const NavBar: FunctionComponent<RouteComponentProps> = (props) => {
    const classes = useStyles();

    const handleClick = (link: string) => {
        props.history.push(link);
    }

    const names = ['חדשות', 'עדכונים לפי אזור', 'פרסם כתבה'];

    return (
        <div className={classes.root}>
            <AppBar classes={{
                root: classes.root
            }}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <AccountCircle />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        ברוך הבא שמעון
                    </Typography>


                    <Button variant='outlined' onClick={() => handleClick(Routes.publish)}
                        className={classes.buttons} size="large" color="inherit" >{names[2]}</Button>

                    <Button variant='outlined' onClick={() => handleClick(Routes.areaNews)}
                        className={classes.buttons} size="large" color="inherit" >{names[1]}</Button>

                    <Button variant='outlined' onClick={() => handleClick(Routes.home)}
                        className={classes.buttons} size="large" color="inherit" >{names[0]}</Button>

                </Toolbar>
            </AppBar>

        </div>
    );
}

export default withRouter(NavBar);
