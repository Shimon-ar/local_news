import React, { FunctionComponent, useState } from 'react';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {Msg, Routes} from '../types';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Drawer from '@material-ui/core/Drawer';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Popover from '@material-ui/core/Popover';
import { useEffect } from 'react';
import DoneIcon from '@material-ui/icons/Done';



const drawerWidth = 180;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            paddingBottom: '60px',
            background: 'transparent',
            boxShadow: 'none',
        },
        menuButton: {
            paddingRight: theme.spacing(2),
        },
        popOver: {
            maxHeight: '300px'
        },
        
        title: {
            flexGrow: 1,
            textAlign: "right",
            color: 'black',
            marginRight: '10px'
        },
        buttons: {
            padding: '0px 10px 0px 10px',
            fontSize: '20px',
            border: 'solid',
            margin: '5px'
        },
        list: {
            textAlign: "right"
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-start',

        },
        icon: {
            fontSize: "35px"
        }
    }),
);


const NavBar: FunctionComponent<RouteComponentProps> = (props) => {
    const classes = useStyles();

    const userContext = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [msgs, setMsgs] = useState<Msg[]>([]);

    const names_every = ['בית', 'עדכונים לפי אזור', 'פרסם כתבה', 'כתבות שאהבתי', 'הכתבות שלי'];
    const routes_every = [Routes.home, Routes.areaNews, Routes.publish, Routes.favorites, Routes.myArticles]
    const names_manager = ['אישור כתבות'];
    const routes_manager = [Routes.confirmArticle];


    useEffect(() => {
        const interval = setInterval(() => {
            getMessages();
        }, 1000);
        return () => clearInterval(interval)
    }, [msgs]);


    const handlePopOver = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick = (link: string) => {
        props.history.push(link);
    }

    const getMessages = async () => {
        if (userContext)
            await fetch(`/messages/${userContext.user.name}`).then(res => res.json().
                then(data => {
                    if (JSON.stringify(data as Msg[]) !== JSON.stringify(msgs)) {
                        setMsgs(data);
                    }
                }))
    };

    const confirmMsg = async (id: number) => {
        await fetch(`/confirmMsg/${id}`).then(res => console.log('confirmed successfully')).
            catch(err => console.log(err));
    }

    const getNumNewMsgs = () => {
        let num = 0;
        msgs.forEach((msg) => {
            if (msg.isNew)
                num += 1;
        });
        return num as number;
    }


    return (
        <div className={classes.root}>
            <AppBar classes={{
                root: classes.root
            }}>
                <Toolbar>
                    <Button variant='outlined' onClick={() => userContext?.setUser({ name: '', id: -1, is_manager: false })}
                        className={classes.buttons} size="small"  >התנתק</Button>

                    <IconButton onClick={handlePopOver}>
                        <Badge color="secondary" badgeContent={getNumNewMsgs()} >
                            <MailIcon fontSize="large" />
                        </Badge>
                    </IconButton>


                    <Popover
                        className={classes.popOver}
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >


                        <List >
                            {msgs.length? msgs.map((msg, index) => (
                                <ListItem className={classes.list} key={index} >
                                    <ListItemText primary={msg.content} dir="rtl"/>

                                    {msg.isNew ?
                                        <IconButton onClick={() => { 
                                            msgs[index].isNew = false;
                                            setMsgs(Object.assign([],msgs));
                                            confirmMsg(msg._id);
                                        }}>
                                            <Typography style={{ fontSize: '10px' }}>
                                                קראתי
                                            </Typography>
                                        </IconButton> :
                                        <DoneIcon style={{ color: "green" }} fontSize="small" />
                                    }
                                </ListItem>
                            )) : <ListItem>
                                <ListItemText primary={'אין לך הודעות'}/>
                            </ListItem>
                            }
                        </List>


                    </Popover>
                    <Typography variant="h6" className={classes.title}>
                        {' ברוך הבא ' + userContext?.user.name}
                    </Typography>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon style={{
                            color: 'black'
                        }} className={classes.icon} />
                    </IconButton>
                </Toolbar>
            </AppBar>


            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
               
                classes={{
                    paper: classes.drawerPaper
                }}>
                <div
                    className={classes.drawerHeader}
                >
                    <IconButton onClick={() => setOpen(false)}>
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>
                </div>
                <Divider />
                <List >
                    {names_every.map((text, index) => (
                        <ListItem button key={text} onClick={() => handleClick(routes_every[index])}>
                            <ListItemText className={classes.list} primary={text} />
                        </ListItem>
                    ))}
                </List>

                {userContext?.user.is_manager ?
                    <div>
                        <Divider />
                        <List >
                            {names_manager.map((text, index) => (
                                <ListItem className={classes.list} button key={text} onClick={() => handleClick(routes_manager[index])}>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))
                            }
                        </List>
                    </div> : <div></div>}
            </Drawer>
        </div>
    );
}

export default withRouter(NavBar);
