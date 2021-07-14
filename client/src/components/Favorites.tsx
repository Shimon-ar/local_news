import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames'
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useState } from "react";
import { Article } from "../types";
import { useEffect } from "react";
import CardNews from "./CardNews";

const useStyles = makeStyles({
    root: {
        paddingLeft: "130px",
        paddingRight: "130px",
        paddingBottom: '50px',
        direction: "rtl"
      
    },
    typoUpdateLabel: {
        marginRight: '7px',
        marginLeft: '7px'
    },

    labelUpdates: {
        maxInlineSize: 'max-content',
        backgroundColor: '#c60021',
        color: '#f6f6f8',
        paddingBottom: '4px',
        paddingLeft: '3px',
        paddingRight: '3px'

    },

    space: {
        marginBottom: '50px'
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
    },

    cardItem: {
        margin: '10px',
        minWidth: '-webkit-fill-available',
    },

});

const Favorites: FunctionComponent = (props) => {

    const classes = useStyles();
    const userContext = useContext(UserContext);
    const [data, setData] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(()=>{
        getFavorites();
    },[])


    const getFavorites = async () => {
        if(userContext)
            fetch(`/getFavoritesNews/${userContext.user.name}`,
            { headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }}
            ).then(res=>res.json())
            .then(data=>{
                setData(data);
                setIsLoading(false);
            });
    }

    

    return (
        <div dir="rtl" className={classes.root}>
            <Grid container
                alignItems="center"
                justify="center">
                    <Grid item xs={12} className={classNames('center-box', classes.space)} >
                    <Box borderRadius={5}  className={classes.labelUpdates}>
                        <Typography variant={'h3'} className={classes.typoUpdateLabel}>כתבות שאהבתי</Typography>
                    </Box>
                </Grid>
                {
                    isLoading ?
                        <div className={classes.progress}>
                            <CircularProgress />
                        </div> : data.length > 0 ?
                            data.map((article, index) => (

                                <Grid item className={classes.cardItem} >
                                    <CardNews {...props} article={article} scale='100px' isFlex={true} />
                                </Grid>
                            )) : <Grid item className={classes.text}> <Typography variant='h5'>לא נבחרו כתבות שאהבת</Typography>  </Grid>
                }
            </Grid>
        </div>
    );

}

export default Favorites;