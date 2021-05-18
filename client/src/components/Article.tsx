import React, { FunctionComponent, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Article_data } from '../types';
import { RouteComponentProps } from 'react-router-dom'
import Divider from '@material-ui/core/Divider';
import { truncate } from 'node:fs';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';





interface ArticleProps extends RouteComponentProps<{ global_id: string }> {
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginLeft: '100px',
            marginRight: '100px',
            direction: 'rtl'
        },

        paper: {
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'transparent'

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
            margin: '30px'
        },

        progress: {
            display: 'flex',
            // backgroundColor: 'white',
            textAlign: 'center',
            position: 'fixed',
            top: '50%',
            left: '50%',
        },
        headLine:{
            fontWeight: 900,
        }

    }),
);

const Article: FunctionComponent<ArticleProps> = (props) => {

    const classes = useStyles();

    const [data, setData] = useState<Article_data>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        fetch(`/article/${props.match.params.global_id}`).then(response => response.json().then(data => {
            console.log(data);
            if (data !== false) {
                setData(data);
            }
            else setError(true);
            setIsLoading(false);
        }))
    }, []);



    return (
        <div className={classes.root}
        style={{
            height: isLoading? '100vh' : 'auto' }}
        >
            {
                isLoading ?
                <div className={classes.progress} >
                    <CircularProgress />
                </div> :
                <Grid container>
                    <Grid item xs={12}>
                        <Box className={classes.paper}>
                            <Typography variant='h4' className={classes.headLine} align='center'>
                                {data?.headline}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item>

                    </Grid>
                    <Grid item >
                        <Typography classes={{
                            subtitle1: classes.subtitle
                        }} variant='subtitle1'>
                            {data?.subtitle}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} className={classes.grid_divider}>
                        <Divider variant={'fullWidth'} orientation='horizontal' />
                    </Grid>


                    {
                        data?.image.includes('defualt') ? <div></div> :
                            <>

                                <Grid item className={classes.grid_img}>
                                    <Paper>
                                        <img src={data?.image} />
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} className={classes.grid_divider}>
                                    <Divider variant={'fullWidth'} orientation='horizontal' />
                                </Grid>
                            </>

                    }
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
            }
        </div>
    )

}

export default Article;