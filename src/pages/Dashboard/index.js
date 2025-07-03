import React from 'react';
import { Grid, Card, Button } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import {
  UnorderedListOutline,
  ShopbagOutline,
  PayCircleOutline,
  UserOutline,
  EnvironmentOutline,
  ReceiptOutline,
} from 'antd-mobile-icons';
import { ORDER_STATUS, ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../../utils/orderStatus';
import './style.css';
import '../../styles/common.css';

const Dashboard = () => {
  const history = useHistory();

  const menuItems = [
    {
      icon: <UnorderedListOutline />,
      text: '订单中心',
      path: '/merchant/order',
      color: '#1677ff',
    },
    {
      icon: <ShopbagOutline />,
      text: '库存查询',
      path: '/merchant/inventory',
      color: '#00b578',
    },
    {
      icon: <PayCircleOutline />,
      text: '财务中心',
      path: '/merchant/finance',
      color: '#ff8f1f',
    },
    {
      icon: <UserOutline />,
      text: '信息管理',
      path: '/merchant/info',
      color: '#ff3141',
    },
    {
      icon: <EnvironmentOutline />,
      text: '报价查询',
      path: '/merchant/price',
      color: '#9f76ff',
    },
    {
      icon: <ReceiptOutline />,
      text: '退件查询',
      path: '/merchant/return',
      color: '#7d74c9',
    },
  ];

  const orderStats = [
    { 
      label: ORDER_STATUS_TEXT[ORDER_STATUS.MERCHANT_PENDING_SHIPMENT], 
      value: 5, 
      color: ORDER_STATUS_COLOR[ORDER_STATUS.MERCHANT_PENDING_SHIPMENT],
      status: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT
    },
    { 
      label: ORDER_STATUS_TEXT[ORDER_STATUS.MERCHANT_SHIPPED], 
      value: 3, 
      color: ORDER_STATUS_COLOR[ORDER_STATUS.MERCHANT_SHIPPED],
      status: ORDER_STATUS.MERCHANT_SHIPPED
    },
    { 
      label: ORDER_STATUS_TEXT[ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING], 
      value: 4, 
      color: ORDER_STATUS_COLOR[ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING],
      status: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING
    },
    { 
      label: ORDER_STATUS_TEXT[ORDER_STATUS.MAIN_LINE_TRANSPORT], 
      value: 6, 
      color: ORDER_STATUS_COLOR[ORDER_STATUS.MAIN_LINE_TRANSPORT],
      status: ORDER_STATUS.MAIN_LINE_TRANSPORT
    },
    { 
      label: ORDER_STATUS_TEXT[ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING], 
      value: 2, 
      color: ORDER_STATUS_COLOR[ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING],
      status: ORDER_STATUS.OVERSEAS_WAREHOUSE_PROCESSING
    },
    { 
      label: ORDER_STATUS_TEXT[ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED], 
      value: 8, 
      color: ORDER_STATUS_COLOR[ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED],
      status: ORDER_STATUS.OVERSEAS_WAREHOUSE_SHIPPED
    },
  ];
  
  // 跳转到订单中心并筛选特定状态的订单
  const goToOrdersWithStatus = (status) => {
    // 将状态信息存储在sessionStorage中，以便订单中心页面可以读取
    sessionStorage.setItem('filterOrderStatus', status);
    history.push('/merchant/order');
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header page-header">
        <div className="back-icon" onClick={goBack}>
          <i className="iconfont icon-left"></i>
        </div>
        <div className="header-content">
          <h2>商家中心</h2>
          <p>欢迎回来，测试商家</p>
        </div>
        <div className="placeholder"></div>
      </div>

      <Card className="dashboard-menu-card">
        <Grid columns={3} gap={8}>
          {menuItems.map((item, index) => (
            <Grid.Item key={index}>
              <div
                className="dashboard-menu-item"
                onClick={() => history.push(item.path)}
              >
                <div className="dashboard-menu-icon" style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
                <div className="dashboard-menu-text">{item.text}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </Card>

      <Card className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="card-title">
            <UnorderedListOutline className="card-icon order-icon" />
            <h3>订单概览</h3>
          </div>
          <Button
            size="small"
            onClick={() => history.push('/merchant/order')}
          >
            查看全部
          </Button>
        </div>
        <Grid columns={2} gap={8}>
          {orderStats.map((item, index) => (
            <Grid.Item key={index}>
              <div 
                className="dashboard-stat-item" 
                onClick={() => goToOrdersWithStatus(item.status)}
              >
                <div className="dashboard-stat-value" style={{ color: item.color }}>{item.value}</div>
                <div className="dashboard-stat-label">{item.label}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </Card>

      <Card className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="card-title">
            <PayCircleOutline className="card-icon balance-icon" />
            <h3>账户余额</h3>
          </div>
          <Button
            size="small"
            onClick={() => history.push('/merchant/finance')}
          >
            充值
          </Button>
        </div>
        <div className="dashboard-balance-container">
          <div className="dashboard-balance-item">
            <div className="dashboard-balance-label">可用余额（可用余额=账户余额-冻结金额）</div>
            <div className="dashboard-balance-value available">¥ 3,280.00</div>
            <div className="dashboard-balance-tip">可用金额为负时，中国仓无法出库，请尽快充值</div>
          </div>
          <div className="dashboard-balance-item">
            <div className="dashboard-balance-label">账户余额</div>
            <div className="dashboard-balance-value total">¥ 5,280.00</div>
            <div className="dashboard-balance-tip">账户余额=总充值金额-中国仓已出库订单费用</div>
          </div>
          <div className="dashboard-balance-item">
            <div className="dashboard-balance-label">冻结金额</div>
            <div 
              className="dashboard-balance-value frozen clickable" 
              onClick={() => history.push('/merchant/frozen-details')}
            >
              ¥ 2,000.00
            </div>
            <div className="dashboard-balance-tip">冻结金额=中国仓完成称重，暂未出库订单费用<br/>如订单在中国仓出库前取消，冻结金额归还至可用余额</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;