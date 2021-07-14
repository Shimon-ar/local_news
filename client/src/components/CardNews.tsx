import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, RouteComponentProps, withRouter, useHistory } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import { Article, Routes } from '../types';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles<Theme, cardProps>((theme: Theme) =>
    createStyles({
        cardContent: {
            textAlign: 'right',
            overflow: "hidden",
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '16px',
            paddingBottom: '0',

        },
        paragraph: {
            fontWeight: 700,
            fontSize: '1rem'
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            placeContent: 'space-between'
        },


        root: {
            direction: 'rtl',
            backgroundColor: '#f6f6f8',
            minHeight: '170px'
        },

        media: {
            width: ({ scale, isFlex }) => isFlex ? scale : '-webkit-fill-available',
            height: ({ scale, isFlex }) => isFlex ? 'unset' : scale
        },

        card: {
            display: ({ isFlex }) => isFlex ? 'flex' : 'block',
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
            marginRight: '4px',
            marginBottom: '4px'
        },
    }),
);

interface cardProps extends RouteComponentProps {
    article?: Article,
    scale: string,
    isFlex: Boolean

}

const CardNews: FunctionComponent<cardProps> = (props) => {

    const classes = useStyles(props);


    const handleLink = () => {
        const article = props.article;
        if (article) {
            console.log(props.article?.global_id);
            props.history.push(Routes.article + '/' + props.article?.global_id);
        }
    }

    return (
        <Box boxShadow={props.isFlex? 10 : 0} borderRadius={16}>
        <Card  square={props.isFlex? false: true}
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

            <div className={classes.details}>
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h6" component="h2" >
                        {props.article?.title}
                    </Typography>
                    <Typography className={classes.paragraph} variant="body2" color="textSecondary" component="p" >
                        {props.article?.description}
                    </Typography>

                </CardContent>

                <div className={classes.controls}>

                    <IconButton onClick={() => {
                        handleLink();
                    }}>
                        <Typography style={{color: 'black', fontWeight: 700}}>
                            צפה בכתבה
                        </Typography>
                    </IconButton>
                </div>
            </div>

        </Card>
        </Box>
    )
}

export default withRouter(CardNews);