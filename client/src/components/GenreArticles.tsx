import React, { FunctionComponent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import { Article, Article_data, HomeData } from '../types';
import { CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames'
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CardNews from './CardNews';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';



interface GenreProps extends RouteComponentProps<{ category: string }> {
}

const useStyles = makeStyles({
    root: {
        marginLeft: '130px',
        marginRight: '130px',
        height: 'auto'
    },
    label: {
        textAlignLast: 'center'
    },
    progress: {
        display: 'flex',
        backgroundColor: 'white',
        textAlign: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
    },
    gridUpdateLabel: {
        paddingTop: '20px',
        paddingBottom: '6px'

    },

    typoUpdateLabel: {
        marginRight: '7px',
        marginLeft: '7px',
        fontSize: '3rem'
    },
    labelUpdates: {
        maxInlineSize: 'max-content'

    },
    cardItem: {
        margin: '10px',
        minWidth: '-webkit-fill-available',
    },
    text: {
        margin: '50px',
        textAlign: 'center',
        minWidth: '-webkit-fill-available',
    }
});


const GenreArticales: FunctionComponent<GenreProps> = (props) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<Article[]>([]);
    const [page, setPage] = useState<number>(1);
    const [error, setError] = useState<boolean>(false);
    const category = props.match.params.category;

    const numResult:number = 10;

    let myMap = new Map([['general', 'חדשות כלליות'],
    ['sports', 'חדשות הספורט'],
    ['technology', 'טכנלוגיה'],
    ['science', 'חדשות במדע']
    ]);


    useEffect(() => {
        getNews(page);
        console.log(category);
    }, []);

    const getNews = async (page: number) => {
        setIsLoading(true);
        await fetch(`/news?category=${category}&page=${page}&num_result=${numResult}`).then(response => response.json().then(data => {
            setData(data);
            setIsLoading(false);
            console.log(data)
        }))
    }

    const handle_next = () => {
        getNews(page + 1);
        setPage(page + 1);
    };

    const handle_prev = () => {
        getNews(page - 1);
        setPage(page - 1);
    };


    return (
        <div className={classes.root}>
            {
                isLoading ?
                    <div className={classes.progress}>
                        <CircularProgress />
                    </div> :
                    <div dir='rtl'>
                        <Grid container>
                            <Grid item xs={12} className={classNames(classes.gridUpdateLabel, 'center-box')}>
                                <Box color="white" bgcolor="error.main" className={classes.labelUpdates}>
                                    <Typography variant={'h5'} className={classes.typoUpdateLabel}>{myMap.get(category)} </Typography>
                                </Box>
                            </Grid>

                            {
                                data.length ? data.map((article, index) => (
                                    <Grid item className={classes.cardItem} >
                                        <CardNews {...props} article={article} scale='100px' isFlex={true} />
                                    </Grid>
                                )) : page > 1 ? <Grid item className={classes.text}> <Typography>אין עוד תוצאות</Typography> </Grid> :
                                    <Grid item className={classes.text}> <Typography variant='h5'>אין תוצאות</Typography>  </Grid>

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
                                    {data.length == numResult ?
                                        <IconButton onClick={() => handle_next()}>
                                            <ArrowBackIcon fontSize='large' />
                                        </IconButton> : <div></div>
                                    }
                                </Grid>

                            </Grid>
                        }

                    </div>
            }
        </div>
    )
}

export default GenreArticales;