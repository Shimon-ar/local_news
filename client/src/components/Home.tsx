import React, { FunctionComponent, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import PublicIcon from '@material-ui/icons/Public';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CardNews from './CardNews';
import { useStyles } from '../styles/HomeStyle';
import { HomeData, Routes } from '../types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';


const Home: FunctionComponent<RouteComponentProps> = props => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<HomeData>();
    const [index, setIndex] = useState<number>(0)
    const dataKeys: string[] = ['general', 'sports', 'technology', 'science'];
    const headLines = ['חדשות כלליות', 'ספורט', 'טכנלוגיה', 'מדע'];
    const headLinesButtons = ['עוד חדשות כלליות', 'עוד בספורט', 'עוד בטכנלוגיה', 'עוד במדע'];


    const onClickLabel = (link: string) => {
        props.history.push(link);
    }


    useEffect(() => {
        fetch("/home").then(response => response.json().then(data => {
            setData(data);
            setIsLoading(false);
        }))
    }, []);


    const handleUpdate = (next: boolean) => {
        const update_len = data ? data.topHeadLines.length : 0;
        setIndex(index => next ? (index + 1) % update_len : (((index - 1) % update_len) + update_len) % update_len);
    }

    return (
        <div className={classes.root} style={{
            height: isLoading? '100vh' : 'auto'
        }}>
            {
                isLoading ?
                    <div className={classes.progress}>
                        <CircularProgress />
                    </div> :
                    <div>
                        <Grid container>

                            <Grid item xs={12} className={classNames(classes.gridUpdateLabel, 'center-box')}>
                                <Box boxShadow={3} borderRadius={5}  className={classes.labelUpdates}>
                                    <Typography variant={'h5'} className={classes.typoUpdateLabel}>מבזקים </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className={classes.gridUpdateContent}>
    
                                <Box  display="flex" justifyContent="space-between" className={classes.boxContent}>
                                    <IconButton onClick={() => handleUpdate(true)}>
                                    <NavigateNextRoundedIcon fontSize='large' />

                                    </IconButton>

                                    <Typography className={classes.textUpdates} variant={'h6'} align={'center'}>
                                        {data?.topHeadLines[index].title}
                                    </Typography>

                                    <IconButton onClick={() => handleUpdate(false)}>
                                    <NavigateBeforeRoundedIcon fontSize='large' />
                                       
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>

                        {
                            headLines.map((headLine, index) => (
                                <div key={index}>
                                    <Box marginBottom={2} textAlign={'right'}>
                                        <IconButton onClick={() => {onClickLabel('genre/' + dataKeys[index]);}}>
                                            <PublicIcon className={classes.icon} />
                                            <Typography className={classes.genre} variant={'subtitle1'}>
                                                {headLinesButtons[index]}
                                            </Typography>
                                        </IconButton>
                                        <Divider  className={classes.divider}/>
                                    </Box>

                                    {
                                    
                                    
                                    
                                     <Box boxShadow={24} borderRadius={16} className={classes.paperStyle} >
                                        <Box style={{
                                            backgroundColor: '#c60021'
                                        }} >
                                            <Typography className={classes.text} variant={'h5'} >{headLine} </Typography>
                                        </Box>
                                        <Grid container spacing={1} className={classes.gridNews}>
                                            <Grid item xs={12}>
                                                <CardNews {...props} article={data ? data[dataKeys[index]][0] : undefined} scale='150px' isFlex={false} />
                                            </Grid>
                                        </Grid>
                                        {
                                            data ? data[dataKeys[index]].slice(1).map((article, index) => (
                                                <Grid container key={index} className={classes.gridNews}>
                                                    <Grid item xs={12} >
                                                        <Typography variant={'subtitle1'} className={classes.titleText}>
                                                            {article.title}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <IconButton className={classes.button} onClick={() => onClickLabel('article/' + article.global_id)}>
                                                              <InfoTwoToneIcon/>
                                                        </IconButton > 
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider className={classes.divider} />
                                                    </Grid>
                                                </Grid>
                                            )) : <></>
                                        }
                                    </Box> 
                                    }
                                </div>

                            ))
                        }
                    </div>
            }
        </div>
    );


}

export default withRouter(Home);



