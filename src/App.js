import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

// 页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';

// 样式
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/merchant" component={Layout} />
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default App;