import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { NavBar, Card, List, Tag, Steps, Button, Toast, Image, ImageViewer } from 'antd-mobile';
import { LocationOutline } from 'antd-mobile-icons';
import { ORDER_STATUS, getOrderStatusInfo, getOrderStatusSteps } from '../../utils/orderStatus';
import { calculateRemainingSlA, formatRemainingSlA } from '../../utils/slaUtils';
import './style.css';

const OrderDetail = () => {
  const history = useHistory();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 模拟获取订单详情数据
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      // 这里应该是实际的API调用
      const mockOrderData = {
        id: orderId,
        orderTime: '2025-05-15 10:30',
        customer: 'John Doe / +92 300 1234567',
        amount: '$120.50',
        // ARL运单状态（使用原有状态）
        arlStatus: ORDER_STATUS.MAIN_LINE_TRANSPORT,
        // Daraz订单状态（使用新增状态）
        darazStatus: ORDER_STATUS.SHIPPED,
        items: [
          {
            id: 'ITEM001',
            name: '男士T恤',
            quantity: 2,
            price: '$25.00',
            total: '$50.00',
            image: '/logo192.png',
          },
          {
            id: 'ITEM002',
            name: '牛仔裤',
            quantity: 1,
            price: '$45.50',
            total: '$45.50',
            image: '/logo192.png',
          },
          {
            id: 'ITEM003',
            name: '运动鞋',
            quantity: 1,
            price: '$25.00',
            total: '$25.00',
            image: '/logo192.png',
          },
        ],
        shipping: {
          method: '国际专线',
          address: 'Pakistan\nPunjab\nRawalpindi - Chaklala\nPunjab, Rawalpindi - Chaklala, Scheme 3\nHouse No. 67, Main Street, Jan Colony, Chaklala Scheme 3 Rawalpindi',
          trackingNo: 'TRK123456',
          estimatedDelivery: '2025-06-01',
          tn: 'RDX-BD-0020314387'
        },
        // Daraz订单状态历史
        darazStatusHistory: [
          {
            status: ORDER_STATUS.PENDING,
            time: '2025-05-15 10:30',
            operator: '系统',
            remark: '订单创建成功',
          },
          {
            status: ORDER_STATUS.PACKED,
            time: '2025-05-16 09:45',
            operator: '张仓管',
            remark: '订单已打包完成',
          },
          {
            status: ORDER_STATUS.READY_TO_SHIP,
            time: '2025-05-17 14:20',
            operator: '李仓管',
            remark: '订单已准备好发货',
          },
          {
            status: ORDER_STATUS.SHIPPED,
            time: '2025-05-19 09:15',
            operator: '王物流',
            remark: '订单已发货',
          },
        ],
        // ARL运单状态历史
        arlStatusHistory: [
          {
            status: ORDER_STATUS.MERCHANT_PENDING_SHIPMENT,
            time: '2025-05-15 11:00',
            operator: '系统',
            remark: 'ARL运单创建成功',
          },
          {
            status: ORDER_STATUS.MERCHANT_SHIPPED,
            time: '2025-05-19 10:30',
            operator: '王物流',
            remark: '商家已发货',
          },
          {
            status: ORDER_STATUS.DOMESTIC_WAREHOUSE_PROCESSING,
            time: '2025-05-20 14:15',
            operator: '国内仓',
            remark: '货物已到达国内仓库',
          },
          {
            status: ORDER_STATUS.MAIN_LINE_TRANSPORT,
            time: '2025-05-22 08:30',
            operator: '国际物流',
            remark: '货物开始国际运输',
          },
        ],
      };

      setOrderData(mockOrderData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderId]);

  // 获取当前状态在流程中的索引
  const getCurrentStepIndex = (status) => {
    return getOrderStatusSteps().findIndex(
      step => step.title === getOrderStatusInfo(status).text
    );
  };

  if (loading) {
    return (
      <div className="order-detail-container">
        <NavBar back="返回" onBack={() => history.goBack()}>订单详情</NavBar>
        <div className="loading-container">加载中...</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-detail-container">
        <NavBar back="返回" onBack={() => history.goBack()}>订单详情</NavBar>
        <div className="error-container">订单不存在或已被删除</div>
      </div>
    );
  }

  // 获取ARL运单状态和Daraz订单状态的信息
  const { arlStatus, darazStatus } = orderData;
  const arlStatusInfo = getOrderStatusInfo(arlStatus);
  const darazStatusInfo = getOrderStatusInfo(darazStatus);

  return (
    <div className="order-detail-container">
      <NavBar back="返回" onBack={() => history.goBack()}>订单详情</NavBar>
      
      {/* ARL运单状态卡片 */}
      <Card className="order-status-card">
        <div className="order-status-header">
          <div className="order-id">ARL运单号: {orderData.id}</div>
          <Tag color={arlStatusInfo.color}>{arlStatusInfo.text}</Tag>
        </div>
        
        <Steps
          current={getCurrentStepIndex(arlStatus)}
          className="order-status-steps"
        >
          {getOrderStatusSteps().map((step, index) => (
            <Steps.Step key={index} title={step.title} description={step.description} />
          ))}
        </Steps>
      </Card>
      
      {/* 订单基本信息 */}
      <Card className="order-info-card">
        <div className="card-title">基本信息</div>
        <List className="order-info-list">
          <List.Item extra={orderData.orderTime}>下单时间</List.Item>
          <List.Item extra={orderData.customer}>客户名称/电话</List.Item>
          <List.Item extra={orderData.amount}>订单金额</List.Item>
          <List.Item extra={<Tag color={darazStatusInfo.color}>{darazStatusInfo.text}</Tag>}>Daraz订单状态</List.Item>
          <List.Item extra={formatRemainingSlA(calculateRemainingSlA(darazStatus, orderData.orderTime))}>SLA剩余</List.Item>
        </List>
      </Card>
      
      {/* 物流信息 */}
      <Card className="order-shipping-card">
        <div className="card-title">物流信息</div>
        <List className="order-shipping-list">
          <List.Item prefix={<LocationOutline />} extra={<div style={{ whiteSpace: 'pre-line' }}>{orderData.shipping.address}</div>}>收货地址</List.Item>
          <List.Item extra={orderData.shipping.tn}>TN</List.Item>
        </List>
      </Card>
      
      {/* 商品列表 */}
      <Card className="order-items-card">
        <div className="card-title">商品列表</div>
        <List className="order-items-list">
          {orderData.items.map(item => (
            <List.Item
              key={item.id}
              prefix={
                <div className="item-image-container" onClick={() => {
                  ImageViewer.show({
                    image: item.image,
                  })
                }}>
                  <Image src={item.image} width={60} height={60} fit='cover' />
                </div>
              }
              title={item.name}
              description={`单价: ${item.price} × ${item.quantity}`}
              extra={item.total}
            />
          ))}
        </List>
      </Card>
      
      {/* ARL运单状态历史 */}
      <Card className="order-history-card">
        <div className="card-title">ARL运单状态历史</div>
        <div className="order-history-timeline">
          {orderData.arlStatusHistory.map((record, index) => {
            const { text, color } = getOrderStatusInfo(record.status);
            return (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" style={{ backgroundColor: color }}></div>
                <div className="timeline-content">
                  <div className="timeline-title">{text}</div>
                  <div className="timeline-time">{record.time}</div>
                  <div className="timeline-operator">{record.operator}</div>
                  <div className="timeline-remark">{record.remark}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Daraz订单状态历史 */}
      <Card className="order-history-card">
        <div className="card-title">Daraz订单状态历史</div>
        <div className="order-history-timeline">
          {orderData.darazStatusHistory.map((record, index) => {
            const { text, color } = getOrderStatusInfo(record.status);
            return (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" style={{ backgroundColor: color }}></div>
                <div className="timeline-content">
                  <div className="timeline-title">{text}</div>
                  <div className="timeline-time">{record.time}</div>
                  <div className="timeline-operator">{record.operator}</div>
                  <div className="timeline-remark">{record.remark}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* 底部操作按钮 */}
      <div className="order-detail-actions">
        <Button
          block
          color="primary"
          onClick={() => Toast.show('功能开发中')}
        >
          查看物流
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;