import React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import {
  AppOutline,
  UnorderedListOutline,
  PayCircleOutline,
  UserOutline,
  ShopbagOutline,
  ReceiptOutline,
} from 'antd-mobile-icons';

// 页面组件
import Dashboard from '../../pages/Dashboard';
import OrderCenter from '../../pages/OrderCenter';
import OrderDetail from '../../pages/OrderDetail';
import InventoryQuery from '../../pages/InventoryQuery';
import SkuDetail from '../../pages/InventoryQuery/SkuDetail';
import ItemChangeHistory from '../../pages/InventoryQuery/ItemChangeHistory';
import FinanceCenter from '../../pages/FinanceCenter';
import RechargeRecords from '../../pages/RechargeRecords';
import ConsumptionRecords from '../../pages/ConsumptionRecords';
import FrozenDetails from '../../pages/FrozenDetails';
import InfoManagement from '../../pages/InfoManagement';
import PriceQuery from '../../pages/PriceQuery';
import ReturnQuery from '../../pages/ReturnQuery';

import './style.css';

const Layout = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const tabs = [
    {
      key: '/merchant/dashboard',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/merchant/order',
      title: '订单中心',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/merchant/inventory',
      title: '库存查询',
      icon: <ShopbagOutline />,
    },
    {
      key: '/merchant/finance',
      title: '财务中心',
      icon: <PayCircleOutline />,
    },

    {
      key: '/merchant/info',
      title: '我的',
      icon: <UserOutline />,
    },
  ];

  const setRouteActive = (value) => {
    history.push(value);
  };

  return (
    <div className="layout-container">
      <div className="layout-content">
        <Switch>
          <Route path="/merchant/dashboard" component={Dashboard} />
          <Route exact path="/merchant/order" component={OrderCenter} />
          <Route path="/merchant/order/:orderId" component={OrderDetail} />
          <Route exact path="/merchant/inventory" component={InventoryQuery} />
          <Route path="/merchant/inventory-query/sku-detail/:shopSku" component={SkuDetail} />
          <Route path="/merchant/inventory-query/item-history/:itemId" component={ItemChangeHistory} />
          <Route exact path="/merchant/finance" component={FinanceCenter} />
          <Route path="/merchant/recharge-records" component={RechargeRecords} />
          <Route path="/merchant/consumption-records" component={ConsumptionRecords} />
          <Route path="/merchant/frozen-details" component={FrozenDetails} />
          <Route path="/merchant/info" component={InfoManagement} />
          <Route path="/merchant/price" component={PriceQuery} />
          <Route path="/merchant/return" component={ReturnQuery} />
        </Switch>
      </div>
      <div className="layout-tabbar">
        <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
};

export default Layout;