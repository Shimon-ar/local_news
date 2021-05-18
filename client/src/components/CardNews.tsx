import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, RouteComponentProps } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import { Article, Routes } from '../types';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles<Theme, cardProps>((theme: Theme) =>
    createStyles({
        cardContent: {
            textAlign: 'right',
            overflow: "hidden",
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '16px',
            paddingBottom: '0',
            backgroundColor: 'none',
            
           
            
        },
        paragraph: {
            fontWeight: 700,
            fontSize: '1rem'
        },

        CardActions: {
            // justifyContent: 'flex-end',
            
        },

        root: {
            direction: 'rtl',
        },

        actions: {
            // minWidth: 'fit-content'
        },

        media: {
            width: ({scale, isFlex}) => isFlex ? scale : '-webkit-fill-available',
            height: ({scale, isFlex}) => isFlex ? 'unset': scale
        },

        card: {
            display: ({isFlex}) => isFlex? 'flex' : 'block',
            backgroundColor: 'transparent'
        }
    }),
);

interface cardProps extends RouteComponentProps{
    article?: Article,
    scale: string,
    isFlex: Boolean

}

const CardNews: FunctionComponent<cardProps> = (props) => {

    const classes = useStyles(props);

    const handleLink = () => {
        const article = props.article;
        if(article)
            props.history.push(Routes.article + '/' + props.article?.global_id);        
    }

    return (
        <Card square={true} 
            classes={{
                root: classes.card
            }} 
            key={props.article?.global_id} className={classes.root}>

            <CardMedia
                classes={{
                    media: classes.media
                }}
                component="img"
                alt={props.article?.urlToImage}
                image={props.article?.urlToImage}
            />
            <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h6" component="h2" >
                    {props.article?.title}
                </Typography>
                <Typography className={classes.paragraph}  variant="body2" color="textSecondary" component="p" >
                    {props.article?.description}
                </Typography>

                
            </CardContent>

            <CardActions
                classes={{
                    root: classes.actions
                }}
             className={classes.CardActions}>
                <IconButton onClick={()=>handleLink()}>
                    <InfoOutlinedIcon fontSize='small'/>
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default CardNews;