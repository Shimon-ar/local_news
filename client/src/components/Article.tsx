import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Article_data } from '../types';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { UserContext } from '../context/UserContext';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { type } from 'node:os';




interface ArticleProps extends RouteComponentProps<{ global_id: string }> {

}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginLeft: '130px',
            marginRight: '130px',
            direction: 'rtl',
            paddingBottom: '50px'
        },

        box: {
            backgroundColor: '#f6f6f8',
            overflow: 'hidden',
            paddingLeft: '30px',
            paddingRight: '30px',
            marginTop: '50px',
            marginBottom: '50px',
            paddingBottom: '40px'
        },

        button: {
            textAlign: 'center',
            fontWeight: 300,
            fontSize: '1.2rem',
            border: "none",
            margin: '2px'

            // marginRight: '20px'
        },

        paper: {
            marginTop: '0px',
            padding: '20px',
            backgroundColor: 'transparent'

        },
        icon: {
            marginTop: '15px',
            paddingTop: '15px',
        },

        iconRed: {
            color: 'red'
        },
        iconBlack: {

        },

        subtitle: {
            fontSize: '24px',
            // marginTop: '30px'
        },

        paragraph: {
            fontSize: '20px'
        },

        grid_divider: {
            // marginBottom: '30px',
            marginTop: '30px',
            marginBottom: '30px'
        },

        grid_img: {
            margin: '0px',

        },
        date: {
            fontSize: "18px"
        },
        gridDate: {
            marginTop: '30px',
            marginLeft: '15px'
        },

        progress: {
            display: 'flex',
            // backgroundColor: 'white',
            textAlign: 'center',
            position: 'fixed',
            top: '50%',
            left: '50%',
        },
        headLine: {
            fontWeight: 900,
        },
        img: {
            maxHeight: '300px'
        }

    }),
);

const Article: FunctionComponent<ArticleProps> = (props) => {

    const classes = useStyles();

    const [data, setData] = useState<Article_data>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const userContext = useContext(UserContext)
    let history = useHistory();
    const article_id = props.match.params.global_id;

    useEffect(() => {
        if (userContext)
            getFavorites(userContext.user.name);

        fetch(`/article/${article_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(response => response.json().then(data => {

            if (data !== false) {
                setData(data);
            }
            else setError(true);
            setIsLoading(false);
        }))
    }, []);

    const toDate = (time: string) => {
        var date = new Date(time);
       return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();        
    }

    const markFavorite = async (user: string, global_id: string) => {
        await fetch(`/markFavorite?user=${user}&id=${global_id}&isMarked=${isFavorite}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(res => res.json().then(data => {
            setIsFavorite(data.some((id: string) => id === article_id));
        }))
    }

    const getFavorites = async (user: string) => {
        await fetch(`/getFavorites/${user}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(res => res.json().then(data => {
            setIsFavorite(data.some((id: string) => id === article_id));
        }))
    }



    return (
        <div className={classes.root}
            style={{
                height: isLoading ? '100vh' : 'auto'
            }}
        >
            {
                isLoading ?
                    <div className={classes.progress} >
                        <CircularProgress />
                    </div> :

                    <Box className={classes.box} boxShadow={24} borderRadius={20}>
                        <Grid container >
                            <Grid container justify={"space-between"} >
                               <Grid item className={classes.icon}>
                                <IconButton onClick={() => history.goBack()}>
                                    <ArrowForwardIcon fontSize='large' />
                                </IconButton>

                                <IconButton onClick={() => {
                                    if (userContext)
                                        markFavorite(userContext?.user.name, article_id);
                                }}>
                                    <FavoriteIcon className={isFavorite ? classes.iconRed : ''} fontSize="large" />
                                </IconButton>
                                </Grid>
                                <Grid item className={classes.gridDate}>
                                <Typography variant="overline"  className={classes.date}>
                                {
                                 data? toDate(data.date) : ""
                                }    
                                </Typography>
                                </Grid>
                                    
                                
                            </Grid>

                            <Grid item xs={12}>
                                <Box className={classes.paper}>
                                    <Typography variant='h4' className={classes.headLine} align='center'>
                                        {data?.headline}
                                    </Typography>
                                </Box>

                            </Grid>

                            <Grid item >
                                <Typography classes={{
                                    subtitle1: classes.subtitle
                                }} variant='subtitle1'>
                                    {data?.subtitle}
                                </Typography>
                            </Grid>



                            {
                                data?.image.includes('defualt') ? <div></div> : data?.image.includes('default') ? <div></div> :
                                    <>
                                        <Grid item xs={12} className={classes.grid_divider}>
                                            <Divider variant={'fullWidth'} orientation='horizontal' />
                                        </Grid>
                                        <Grid item className={classes.grid_img}>
                                            <Paper>
                                                <img src={data?.image} className={classes.img} />
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12} className={classes.grid_divider}>
                                            <Divider variant={'fullWidth'} orientation='horizontal' />
                                        </Grid>
                                    </>}
                            {
                                data?.body.map(content =>
                                    <Grid item>
                                        <Typography className={classes.paragraph} variant='subtitle2' paragraph>
                                            {content}
                                        </Typography>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Box>
            }

        </div>
    )

}

export default withRouter(Article);