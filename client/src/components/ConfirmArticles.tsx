import { FunctionComponent, useEffect, useState } from "react";
import { APPROVED, Article, CATEGORY, Routes, STATUS, UNAPPROVED } from "../types";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RouteComponentProps, withRouter } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    root: {
        paddingLeft: "130px",
        paddingRight: "130px",
        paddingBottom: '50px'
    },
    title: {
        marginBottom: "15px",
        paddingTop: "12px"
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
        
    },

    textField: {
        width: '250px',
        direction: 'rtl'

    },
    margin: {
        margin: "10px"
    },


    dir: {
        direction: 'rtl',
    },

    button: {
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '17px',
        border: "none",
        margin: '2px',
        color: 'black'
    },

    space: {
        marginBottom: '50px'
    },
    textSecondery: {
        fontSize: '18px',
        fontWeight: 300
    },



    gridItem: {
        maxWidth: "800px",
        marginTop: "15px"
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
        color: 'black',
        marginRight: '4px',
        fontWeight: 700
    },

    dialog: {
        alignSelf: 'center'
    },

});


const ConfirmArticles: FunctionComponent<RouteComponentProps> = (props) => {

    const classes = useStyles();
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<Article[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<{ open: boolean, text: string }>({ open: false, text: '' });
    const category = 'temp_articles';
    const numResult = 10;
    const userContext = useContext(UserContext);

    useEffect(() => {
        getNews(page);

    }, []);

    const getNews = async (page: number) => {
        setIsLoading(true);
        await fetch(`/news?category=${category}&page=${page}&num_result=${numResult}`).then(response => response.json().then(data => {
            setData(data);
            setIsLoading(false);
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

    const onCloseDialog = () => setOpenDialog({ open: false, text: '' });

    const confirmArticle = async (article_id: string, status: string, index: number) => {
        await fetch(`/confirmArticle?id=${article_id}&status=${status}&user=${userContext?.user.name}`).then(response =>  {
            console.log(status);
            if (status === APPROVED)
                setOpenDialog({ open: true, text: 'הכתבה אושרה בהצלחה' });
            else if (status === UNAPPROVED)
                setOpenDialog({ open: true, text: 'הכתבה נדחתה בהצלחה' });
            data[index].status = status;
        })
    };

    return (
        <div dir="rtl" className={classes.root}>
            <Grid container
                alignItems="center"
                justify="center">
               <Grid item xs={12} className={classNames('center-box', classes.space)} >
                    <Box borderRadius={5}  className={classes.labelUpdates}>
                        <Typography variant={'h3'} className={classes.typoUpdateLabel}>אישור כתבות</Typography>
                    </Box>
                </Grid>
                {
                    isLoading ?
                        <div className={classes.progress}>
                            <CircularProgress />
                        </div> : data.length > 0 ?
                            data.map((article, index) => (
                                <Grid key={index} item xs={12} className={classes.gridItem}>

                                    <Box style={{
                                        marginBottom: '10px',
                                        backgroundColor: '#f6f6f8'
                                    }} key={index} borderRadius={5} boxShadow={10}
                                       >
                                        <Box marginRight={3}>
                                            <Typography variant="h5"  className={classes.title}>
                                                כותרת: {article.title}
                                            </Typography>


                                            <Typography className={classes.textSecondery}>
                                                קטגוריה: {CATEGORY.get(article.category)}
                                            </Typography>
                                            <Typography className={classes.textSecondery}>
                                                מחבר: {article.author}
                                            </Typography>

                                        </Box>
                                        <Box marginRight={1} display="flex" justifyContent="space-between">

                                            <IconButton
                                              onClick={() => {
                                                props.history.push(Routes.article + '/' + article.global_id);
                                            }}
                                            >
                                                <Typography className={classes.text}>
                                                צפה בכתבה
                                                </Typography>
                                            </IconButton>
                                            



                                            {article.status === APPROVED ?
                                                <DoneIcon className={classes.margin} fontSize="large" style={{ color: "green" }} /> : article.status === UNAPPROVED ?
                                                    <CloseIcon className={classes.margin} fontSize="large" style={{ color: "red" }} /> :

                                                    <ButtonGroup className={classes.margin}>
                                                        <Button
                                                            className={classes.button}
                                                            size='small'
                                                            onClick={() =>
                                                                confirmArticle(article.global_id, APPROVED, index)}
                                                            component="label"> אשר</Button>

                                                        <Button
                                                            className={classes.button}
                                                            size='small'
                                                            onClick={() => confirmArticle(article.global_id, UNAPPROVED, index)}
                                                            component="label">דחה</Button>
                                                    </ButtonGroup>
                                            }
                                        </Box>



                                    </Box>
                                </Grid>
                            )) : page > 1 ? <Grid item className={classes.text}> <Typography>אין עוד תוצאות</Typography> </Grid> :
                                <Grid item className={classes.text}> <Typography variant='h5'>לא פורסמו כתבות</Typography>  </Grid>
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
                    <Button onClick={onCloseDialog} color="primary">
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )

};

export default withRouter(ConfirmArticles);

