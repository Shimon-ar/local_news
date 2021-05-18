import React, { FunctionComponent, useEffect, useState } from 'react';
import Home from './components/Home';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';
import { Routes } from './types';
import AreaNews from './components/AreaNews';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, makeStyles } from '@material-ui/core/styles';
import { create } from 'jss';
import PublishArticle from './components/PublishArtical';
import Article from './components/Article';
import GenreArticales from './components/GenreArticles';
import Login from './components/Login';
 
const useStyles = makeStyles({
  root: {
        backgroundImage: "url('/color.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundBlendMode: 'color',
  }
})

const App: FunctionComponent = props => {

  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
  const classes = useStyles();

  const [isLogged, setIsLogged] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(()=> {
    fetch('/isLogin').then(res=> res.json().then(res => {
      console.log('fetched');
      if (res == true && !isLogged){
          setIsLogged(true);
      }
      
      else if(res ==false && isLogged)
          setIsLogged(false);

    }))
  })

  useEffect(()=> {console.log(isLogged + '   effe')}, [isLogged]);

  const isLogin = async () => {
    await fetch('/isLogin').then(res=> res.json().then(res => res)) 
  }





  return (
<div className={classes.root}>
    <StylesProvider jss={jss} >
      <BrowserRouter >


        <Switch>
          <Route exact path='/home'
            render={(props) => 
            (
              isLogin() ?
            <div>
              <NavBar />
              <Home {...props} />
            </div>   :
            <Redirect to={Routes.login} />
            )}
          />

          <Route exact path={Routes.areaNews}
            render={(props) => 
            (
              isLogged?
            <div>
              <NavBar />
              <AreaNews {...props} />
            </div> :
            <Redirect to={Routes.login} />
            )  
          } />

          <Route exact path={Routes.publish}
            render={() => (
             isLogged?
             <div>
                <NavBar />
                <PublishArticle />
              </div> :
              <Redirect to={Routes.login} />
            )  
            } />

          <Route exact path='/article/:global_id'
            render={(props) => 
            (
              isLogged?
            <div>
              <NavBar />
              <Article {...props} />
              </div> :
              <Redirect to={Routes.login} />
            )  
            } />

          <Route exact path='/genre/:category'
            render={(props) => 
            (
              isLogged?
            <div>
              <NavBar />
              <GenreArticales {...props} />
              </div>:
              <Redirect to={Routes.login} />
            )  
            
            } />

          <Route exact path={Routes.login}
            render={(props) => <Login {...props} />} />

          <Redirect to={Routes.login} />
        </Switch>

      </BrowserRouter>



    </StylesProvider>
    </div>

  );
}

export default App;

