import React, { FunctionComponent, useEffect, useState } from 'react';
import Home from './components/Home';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'
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
import PrivateRoute from './components/PrivateRoute';
import ConfirmArticles from './components/ConfirmArticles';
import Favorites from './components/Favorites';
import MyArticles from './components/MyArticles';

const useStyles = makeStyles({
  root: {
    
    // backgroundImage: "url('/color.jpg')",
    // backgroundSize: 'cover',
    // backgroundPosition: 'center center',
    // backgroundBlendMode: 'color',
    dir:"rtl"
  }
})

const App: FunctionComponent = props => {

  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <StylesProvider jss={jss} >
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path='/home'
            RouteComponent={() =>
            <div>
              <NavBar/>
              <Home/>
            </div>
            }
           />

            <PrivateRoute exact path={Routes.areaNews}
              RouteComponent={() =>
              (<div>
                  <NavBar />
                  <AreaNews />
                </div>
              )} />

            <PrivateRoute exact path={Routes.publish}
              RouteComponent={() => (
                <div>
                  <NavBar />
                  <PublishArticle />
                </div>
              )} />

            <PrivateRoute exact path='/article/:global_id'
              RouteComponent={() =>
              ( <div>
                    <NavBar />
                    <Article/>
                  </div>
               ) } />

            <PrivateRoute exact path='/genre/:category'
              RouteComponent={() =>
              ( <div>
                    <NavBar />
                    <GenreArticales/>
                  </div>)
              } />

            <PrivateRoute exact path={Routes.confirmArticle}
              RouteComponent={() => (
                <div>
                <NavBar />
                <ConfirmArticles/>
              </div>
              )}
            />

            <PrivateRoute exact path={Routes.favorites}
                RouteComponent={() => (
                  <div>
                  <NavBar />
                  <Favorites/>
                </div>
                )}
                />
            
            <PrivateRoute exact path={Routes.myArticles}
                      RouteComponent={() => (
                        <div>
                        <NavBar />
                        <MyArticles/>
                      </div>
                      )}
                      />


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

