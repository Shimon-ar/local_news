import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '130px',
            marginRight: '130px',
            direction: 'rtl',
            paddingBottom: '50px',
            // minWidth: "100%",
            // width: '100%',
            // height: '100vh'
            // minWidth: "100%",

        },
        height: {
            height: '100vh'
        },

        gridContainer: {
            marginLeft: '100px',
            marginRight: '100px',
        },

        textUpdates: {
            alignSelf: 'center',
        },
        labelUpdates: {
            maxInlineSize: 'max-content',
            backgroundColor: '#c60021',
            color: '#f6f6f8',
            paddingBottom: '4px',
            paddingLeft: '3px',
            paddingRight: '3px'

        },
        boxContent: {
            // backgroundColor: '#f5f5f5',
        },

        gridUpdateLabel: {
            paddingTop: '20px',
            paddingBottom: '6px'

        },

        typoUpdateLabel: {
            marginRight: '7px',
            marginLeft: '7px',
            fontSize: '28px'

        },

        gridUpdateContent: {
            paddingBottom: '50px',
            // backgroundColor: '#f5f5f5',

        },
        cardGrid: {
            padding: '20px'
        },

        gridText: {
            textAlign: 'right',
            padding: '20px'
        },

        icon: {
            marginRight: '5px',
            color: 'black'
        },

        paperStyle: {
            border: '5px solid',
            borderColor: '#c60021',
            textAlign: 'center',
            marginBottom: '55px',
            backgroundColor: '#f6f6f8'

        },
        text: {
            color: '#f6f6f8'
        },

        gridNews: {
            textAlign: 'right',
        },

        descriptionText: {
            marginRight: '10px',
            fontSize: '12px'
        },
        titleText: {
            marginRight: '15px',
            fontSize: '18px',
            fontWeight: 500,
            marginTop: '5px'

        },
        button: {
            color: 'black'

        },
        divider: {
            marginRight: '10px',
            marginLeft: '10px',


        },
        progress: {
            display: 'flex',
            backgroundColor: 'transparent',
            // backgroundImage: 'inherent'
            textAlign: 'center',
            position: 'fixed',
            top: '50%',
            left: '50%',
            height: '100vh'
        },
        genre: {
            fontSize: '20px',
            fontWeight: 500,
            color: 'black',
            marginRight: '4px'
        }



    }),
);