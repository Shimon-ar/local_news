import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames'
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UserContext } from '../context/UserContext';
import { Autocomplete } from '@material-ui/lab';
import { CATEGORY } from '../types';






const useStyles = makeStyles({
    root: {
        paddingLeft: '130px',
        paddingRight: '130px',
        // backgroundImage: "url('/color.jpg')",
        // backgroundSize: 'cover',
        paddingBottom: '50px'

    },

    label: {
        whiteSpace: 'nowrap',
        fontSize: '1.2rem',
        marginLeft: '20px',
        margin: '5px',
        fontWeight: 700
    },

    gridUpdateLabel: {
        paddingTop: '20px',
        paddingBottom: '6px'

    },
    dir: {
        direction: 'rtl',
    },

    typoUpdateLabel: {
        marginRight: '7px',
        marginLeft: '7px',
        fontSize: '3rem'
    },
    labelUpdates: {
        maxInlineSize: 'max-content',
        backgroundColor: '#c60021',
        color: '#f6f6f8',
        paddingBottom: '4px',
        paddingLeft: '3px',
        paddingRight: '3px',
        marginBottom: '20px'

    },
    box: {
        // padding: '10px',
        maxWidth: '450px',
        // backgroundColor: 'white',
        // flexDirection: "column",
        // textAlign: 'center',
        paddingLeft: '60px',
        paddingRight: '60px',
        paddingTop: '15px',
        maxHeight: '700px',
        // paddingBottom: '60px',
        backgroundColor: '#f6f6f8',
        // marginTop: '100px',
        // marginBottom: 'px'
        // marginTop: '60px'
        // alignItems: "center",
        // paddingBottom: '100px'


    },
    textField: {
        direction: 'rtl'
    },
    button: {
        fontWeight: 700,
        fontSize: '1.2rem'
    },
    buttonUpload: {
        fontWeight: 700
    },
    publish: {
        margin: '50px'
    },
    dialog: {
        alignSelf: 'center'
    },

    alert: {
        backgroundColor: 'inherit',

    }


});

interface error {
    title: boolean;
    description: boolean;
    category: boolean;

}



const PublishArticle: FunctionComponent = (props) => {

    const classes = useStyles();
    const [image, setImage] = useState<any>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [errors, setErrors] = useState<error>({ title: false, description: false, category: false });
    const [openDialog, setOpenDialog] = useState<{ open: boolean, text: string }>({ open: false, text: '' });
    const [category, setCategory] = useState<string>('')
    const userContext = useContext(UserContext);
    

    const onPublish = () => {
        if (!validate() || !userContext)
            return;

        const data = new FormData();
        data.append('title', title);
        data.append('description', description);
        data.append('user', userContext.user.name);
        data.append('category', category);

        if (image)
            data.append('file', image)

        sendPost(data);
    }

    const sendPost = (data: FormData) => {
        if (!data)
            return;
        fetch('/upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            if (response.ok) {
                setOpenDialog({ open: true, text: 'הכתבה פורסמה בהצלחה וכעת ממתינה לאישור.' });
                clearForm();
            }
            else setOpenDialog({ open: true, text: 'הכתבה לא פורסמה עקב שגיאת מערכת.' })
        }).catch(e => setOpenDialog({ open: true, text: 'הכתבה לא פורסמה עקב שגיאת מערכת.' }));
    }

    const clearForm = () => {
        setImage(null);
        setTitle('');
        setDescription('');
    }

    const validate = () => {
        setErrors({
            title: title === '',
            description: description === '',
            category: category === ''
        })
        return title != '' && description != '' && category;
    }

    const onCloseDialog = () => setOpenDialog({ open: false, text: '' });

    return (
        <div dir='rtl' className={classes.root}>

            <Grid container>

            <Box borderRadius={16} boxShadow={20} className={ classNames(classes.box, 'vertical-center')}>
                <Grid container >
                    <Grid item xs={12} className={classNames(classes.gridUpdateLabel, 'center-box')}>
                        <Box boxShadow={3} borderRadius={5} className={classes.labelUpdates}>
                            <Typography variant={'h5'} className={classes.typoUpdateLabel}>פרסם כתבה</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} className={'center-box'}>
                        <Box >
                            <Typography dir='rtl' className={classes.label} variant="button" display="block" gutterBottom>
                                כותרת ראשית:
                            </Typography>

                            <TextField variant='outlined' fullWidth size='small' id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                classes={{ root: classes.textField }} inputProps={{ style: { fontSize: '1.2rem' } }} />
                            {errors.title ? <Alert dir='rtl' severity="error" className={classes.alert}>שדה חובה</Alert> : <div></div>}
                        </Box>
                    </Grid>

                    <Grid item xs={12} className={classNames('center-box', classes.textField)}>
                    <Box marginTop={2}>
                        <Autocomplete
                            classes={{
                                listbox: classes.dir
                            }}
                            onChange={(e, value) => {
                                    setCategory(value);
                                }}
                            noOptionsText={'אין התאמה'}
                            options={Array.from(CATEGORY.keys())}
                            disableClearable
                            getOptionLabel={(option) => CATEGORY.get(option) || ''}
                            renderInput={(params) => <TextField {...params} placeholder="קטגוריה" className={classes.textField} />}
                        />
                        {errors.category ? <Alert dir='rtl' severity="error" className={classes.alert}>שדה חובה</Alert>: <div></div>}
                        </Box>
                    </Grid>

                    <Grid item xs={12} className={'center-box'}>
                        <Box marginTop={2}>
                            <Typography dir='rtl' className={classes.label} variant="h6" display="block" gutterBottom>
                                תיאור מפורט:
                            </Typography>
                            <TextField
                                onChange={(e) => setDescription(e.target.value)}
                                variant="outlined"
                                size='medium'
                                fullWidth
                                value={description}
                                id="description"
                                multiline
                                rows={10}
                                inputProps={{ style: { fontSize: '1.2rem' } }}
                                classes={{ root: classes.textField }}
                            />
                            {errors.description ? <Alert dir='rtl' severity="error" className={classes.alert}>שדה חובה</Alert> : <div></div>}
                        </Box>
                    </Grid>

                    <Grid item xs={12} className={'center-box'}>
                        <Box marginTop={2}>
                            <Button
                                className={classes.buttonUpload}
                                size='large'
                                variant="outlined"
                                component="label"

                            >
                                העלאת תמונה
                                <input
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setImage(e.target.files[0]);
                                        }
                                    }}
                                    accept="image/*"
                                    type="file"
                                    hidden

                                />
                            </Button>
                            {image ?
                                <Typography color='textSecondary' variant="caption" display="block" gutterBottom>
                                    {image.name}
                                </Typography> : <div></div>
                            }
                        </Box>

                    </Grid>

                    <Grid item xs={12} className={classNames('center-box', classes.publish)}>

                        <Button size='large' dir='rtl' className={classes.button}
                            variant="outlined"
                            onClick={() => { onPublish() }}
                        >
                            פרסם כתבה!
                        </Button>

                    </Grid>


                </Grid>
            </Box>

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
                    <Button onClick={onCloseDialog} color="primary">
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default PublishArticle


