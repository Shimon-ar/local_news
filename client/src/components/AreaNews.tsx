import React, { FunctionComponent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import classNames from 'classnames'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Card } from '@material-ui/core';
import { Article, City } from '../types';
import CardNews from './CardNews';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';



const useStyles = makeStyles({
    root: {
        paddingLeft: "130px",
        paddingRight: "130px",
        paddingBottom: '50px'
    },
    label: {
        textAlignLast: 'center'
    },
    labelUpdates: {
        maxInlineSize: 'max-content',
        backgroundColor: '#c60021',
        color: '#f6f6f8',
        paddingBottom: '4px',
        paddingLeft: '3px',
        paddingRight: '3px'

    },
    typoUpdateLabel: {
        marginRight: '7px',
        marginLeft: '7px'
    },

    textField: {
        width: '250px',
        direction: 'rtl',
        borderColor: 'black'

    },

    dir: {
        direction: 'rtl',
    },

    gridButton: {
        textAlign: 'center',
        marginTop: '5px',
        marginBottom: '50px'

    },
    button: {
        borderWidth: '1.5px',
        fontWeight: 500,
        width: '250px',
        fontSize: '20px',
        padding: '0',
        borderColor: 'black'
    },


    space: {
        marginBottom: '50px'
    },

    cardItem: {
        margin: '10px',
        minWidth: '-webkit-fill-available',
    },

    progress: {
        display: 'flex',
        backgroundColor: 'white',
        textAlign: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
    },

    text: {
        margin: '50px',
        textAlign: 'center',
        minWidth: '-webkit-fill-available',
    }

});


const AreaNews: FunctionComponent<RouteComponentProps> = (props) => {

    const classes = useStyles();
    const max_result = 10;
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [city, setCity] = useState<string>('');
    const [news, setNews] = useState<Article[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isSearched, setIsSearched] = useState<boolean>(false);

    useEffect(() => {
        fetch_cities();
    }, []);

    const fetch_cities = () => {
        fetch("/cities").then(response => response.json().then(data => {
            setCities(data);
        }))
    }

    const perform_search = async (city: string, page: number) => {
        setIsLoading(true);
        await fetch(`/search?page=${page}&city=${city}`).then(response => response.json().then(
            data => {
                setNews(data);
                setIsLoading(false);
                setIsSearched(true);
            }
        ));

    }

    const handle_next = () => {
        perform_search(city, page + 1);
        setPage(page + 1);
    };

    const handle_prev = () => {
        perform_search(city, page - 1);
        setPage(page - 1);
    };


    return (
        <div dir="rtl" className={classes.root}>

            <Grid container>
                <Grid item xs={12} className={classNames('center-box', classes.space)} >
                    <Box borderRadius={5}  className={classes.labelUpdates}>
                        <Typography variant={'h3'} className={classes.typoUpdateLabel}>   עדכונים לפי אזור </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} className={classNames('center-box', classes.textField)}>
                    <Autocomplete
                        classes={{
                            listbox: classes.dir
                        }}
                        onChange={(e, value) => setCity(value.name_he)}
                        noOptionsText={'אין התאמה'}
                        options={cities}
                        disableClearable
                        getOptionLabel={(option) => option.name_he}
                        renderInput={(params) => <TextField {...params} placeholder="חפש לפי עיר" className={classes.textField} />}
                    />
                </Grid>

                <Grid item xs={12} className={classNames('center-box', classes.gridButton)} >
                    <Button variant={'outlined'}  
                        onClick=
                        {() => {
                            perform_search(city, 1);
                            setPage(1);
                        }}
                        className={classes.button}>חפש</Button>
                </Grid>

                {
                    isLoading ?
                        <div className={classes.progress}>
                            <CircularProgress />
                        </div> : news.length > 0 ?
                            news.map((article, index) => (
                                <Grid item className={classes.cardItem} >
                                    <CardNews {...props} article={article} scale='100px' isFlex={true} />
                                </Grid>
                            )) : isSearched ? page > 1 ? <Grid item className={classes.text}> <Typography>אין עוד תוצאות</Typography> </Grid> :
                                <Grid item className={classes.text}> <Typography variant='h5'>אין תוצאות עבור העיר המבוקשת</Typography>  </Grid> : <div></div>
                }
            </Grid>

            {isLoading ? <div></div> :
                <Grid container justify='space-between' alignContent='stretch'>
                    <Grid item >
                        {page > 1 ?
                            <IconButton onClick={() => handle_prev()}>
                                <ArrowForwardIcon fontSize='large' />
                            </IconButton> : <div></div>
                        }
                    </Grid>

                    <Grid item>
                        {news.length == max_result ?
                            <IconButton onClick={() => handle_next()}>
                                <ArrowBackIcon fontSize='large' />
                            </IconButton> : <div></div>
                        }
                    </Grid>

                </Grid>
            }
        </div>




    )
}

export default withRouter(AreaNews);