import { useEffect } from "react";
import { FunctionComponent, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { APPROVED, Article, CATEGORY, Routes, STATUS, UNAPPROVED } from "../types";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames'
import DeleteIcon from '@material-ui/icons/Delete';
import { RouteComponentProps, withRouter } from "react-router-dom";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';



const useStyles = makeStyles(theme =>  ({
    root: {
        paddingLeft: "130px",
        paddingRight: "130px",
        paddingBottom: '50px'

    },
    title: {
        marginBottom: "4px",
        paddingTop: "7px"
    },
    button: {
        color: 'black',
        fontWeight: 700

    },

    overflowWithDots: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '600px'
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
        marginLeft: '7px',
        // color: '#c60021'
    },
    color:{
        color: '#c60021'
    },

    textField: {
        width: '250px',
        direction: 'rtl'

    },

    margin: {
        marginTop: "10px"
    },


    card: {
        direction: 'rtl',
        display: 'flex',
        height: "250px",
        backgroundColor: '#f6f6f8'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
      },
    content: {
        flex: '1 0 auto',
        
        textAlign: 'right',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '16px',
        paddingBottom: '0',
        backgroundColor: 'none',
    },
    cover: {
        width: 150,
        height: 250
      },

    controls: {
        display: 'flex',
        alignItems: 'left',
        textAlign: 'left',
        marginBottom: '300px'
      },
    space: {
        marginBottom: '50px'
    },

    gridItem: {
        maxWidth: "800px",
        marginTop: "15px"
    },

    progress: {
        display: 'flex',
        backgroundColor: 'transparent',
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

    dialog: {
        alignSelf: 'center'
    },

}));

const MyArticles: FunctionComponent<RouteComponentProps> = (props) => {

    const classes = useStyles();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<Article[]>([]);
    const category = 'temp_articles';
    const userContext = useContext(UserContext);
    const [openDialog, setOpenDialog] = useState<{ open: boolean, text: string }>({ open: false, text: '' });
    const [chosenArticle, setChosenArticle] = useState<{global_id: string, index: number} | null>(null);



    useEffect(() => {
        getArticles();
    }, [])


    const getArticles = async () => {

        await fetch(`/news?category=${category}&page=${1}&num_result=${100}&field=author&key=${userContext?.user.name}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(response => response.json().then(data => {
            setData(data);
            setIsLoading(false);
        }))
    }

    const onCloseDialog = () => setOpenDialog({open:false, text:''});

    const deleteArticle = async (id: string ,index:number) => {
        await fetch(`/deleteArticle/${id}`).then(res => {
            let new_data = Object.assign([],data);
            new_data.splice(index,1);
            setData(new_data);
        })
        .catch(err => console.log(err)); 
    };

    return (
        <div  className={classes.root}>
            <Grid container
                alignItems="center"
                justify="center">
              <Grid item xs={12} className={classNames('center-box', classes.space)} >
                    <Box borderRadius={5}  className={classes.labelUpdates}>
                        <Typography variant={'h3'} className={classes.typoUpdateLabel}> הכתבות שלי</Typography>
                    </Box>
                </Grid>
                {

                    isLoading ?
                        <div className={classes.progress}>
                            <CircularProgress />
                        </div> : data.length > 0 ?
                            data.map((article, index) => (
                                <Grid key={index} item xs={12} className={classes.gridItem}>
                                    <Box  boxShadow={20} borderRadius={24} >
                                        
                                    <Card className={classes.card}  classes={{root: classes.card}} >
                                    {
                                        article.urlToImage !== ""?
                                        <CardMedia
                                        component="img"
                                            className={classes.cover}
                                            image={article.urlToImage}
                                        />: <div></div>}

                                        <div className={classes.details}>
                                            <CardContent  className={classes.content}>
                                                <Typography gutterBottom component="h5" variant="h5">
                                                    {article.title}
                                                </Typography>
                                                
                                                <Typography gutterBottom variant="subtitle1" className={classes.overflowWithDots} color="textSecondary">
                                                    {article.description}
                                                </Typography>

                                                <Typography variant='h6'   color="textPrimary">
                                                    {CATEGORY.get(article.category)}
                                                </Typography>
                                                <Typography variant='h6' color="textPrimary">
                                                    {`סטטוס: ${STATUS.get(article.status)}`}
                                                </Typography>
                                                {
                                                    article.status === APPROVED?
                                                        <DoneIcon className={classes.margin} style={{color: 'green'}} fontSize='large'/>
                                                        : article.status == UNAPPROVED?
                                                        <CloseIcon className={classes.margin} style={{color: 'red'}} fontSize='large'/>
                                                        : <HourglassEmptyIcon className={classes.margin} />
                                                }

                
                                            </CardContent>
                                            <div className={classes.controls}>
                                                
                                                <IconButton onClick={()=> {
                                                    
                                                    setChosenArticle({
                                                        global_id: article.global_id,
                                                        index: index
                                                    });

                                                    setOpenDialog({open:true, text: 'האם אתה בטוח שאתה רוצה למחוק את הכתבה?'})
                                                }}>
                                                <DeleteIcon/>   
                                                </IconButton>

                                                <IconButton
                                                    onClick={() => {
                                                        props.history.push(Routes.article + '/' + article.global_id);
                                                    }}>
                                                    <Typography className={classes.button}>
                                                    צפה בכתבה 
                                                    </Typography>
                                                    
                                                </IconButton>
                                                
                                            </div>
                                        </div>       
                                    </Card>
                                    </Box>


                                    </Grid>
                            )) : <Grid item className={classes.text}> <Typography>אין תוצאות</Typography> </Grid>
                }
            </Grid>


            <Dialog
                dir='rtl'

                open={openDialog.open}
                onClose={onCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {openDialog.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.dialog}>
                <Button onClick={()=> {
                    if (chosenArticle)
                        deleteArticle(chosenArticle.global_id, chosenArticle.index);
                    setChosenArticle(null);
                    onCloseDialog();
                }} color="primary">
                    מחק כתבה
                    </Button>
                    <Button onClick={() => {
                    setChosenArticle(null);
                    onCloseDialog();
                    } } color="primary">
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>
        </div >    

    );
}

export default withRouter(MyArticles);